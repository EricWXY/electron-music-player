const { ipcRenderer, BrowserWindowProxy } = require('electron')
const { $ } = require('./utils')
const path = require('path')

let musicFilePath = []

$('select-music').addEventListener('click', () => {
  ipcRenderer.send('open-music-file')
})

$('add-music').addEventListener('click', () => {
  if (musicFilePath.length != 0) {
    ipcRenderer.send('add-tracks', musicFilePath)
    alert('导入成功')
  } else {
    alert('没有选择任何歌曲...\n\r请选择你喜欢的本地歌曲')
  }
})

ipcRenderer.on('selected-file', ({ }, path) => {
  if (path instanceof Array) {
    renderListHTML(path)
    musicFilePath = path
  }
})

const renderListHTML = paths => {
  let musicList = $('music-list')
  let musicItemsHTML = paths.reduce((html, music) => {
    html += `<li class="list-group-item">${path.basename(music)}</li>`
    return html
  }, '')
  musicList.innerHTML = `<ul class="list-group">${musicItemsHTML}</ul>`
}