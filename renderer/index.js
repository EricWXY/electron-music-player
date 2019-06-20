const { ipcRenderer } = require('electron')
const { $, timeFormatter } = require('./utils')
const musicAudio = new Audio()

let allTracks
let currentTrack



$('add-music-button').addEventListener('click', () => {
  ipcRenderer.send('add-music-window')
})

$('tracks-list').addEventListener('click', event => {
  event.preventDefault()
  let { dataset, classList } = event.target
  let id = dataset && dataset.id
  if (id && classList.contains('fa-play')) {
    if (currentTrack && currentTrack.id === id) {
      musicAudio.play()
    } else {
      currentTrack = allTracks.find(item => item.id === id)
      musicAudio.src = currentTrack.path
      musicAudio.play()
      let resetIconEle = document.querySelector('.fa-pause')
      if (resetIconEle) {
        resetIconEle.classList.replace('fa-pause', 'fa-play')
      }
    }

    classList.replace('fa-play', 'fa-pause')
  } else if (id && classList.contains('fa-pause')) {
    musicAudio.pause()
    classList.replace('fa-pause', 'fa-play')
  } else if (id && classList.contains('fa-trash-alt')) {
    ipcRenderer.send('delete-track', id)
  }
})

musicAudio.addEventListener('loadedmetadata', () => {
  renderPlayerHTML(currentTrack.fileName, musicAudio.duration)
})

musicAudio.addEventListener('timeupdate', () => {
  updateProgressHTML(musicAudio.currentTime, musicAudio.duration)
})

ipcRenderer.on('update-tracks', ({ }, tracks) => {
  renderListHTML(tracks)
  allTracks = tracks
})

const renderListHTML = tracks => {
  let tracksList = $('tracks-list')
  let tracksListHTML = tracks.reduce((html, track) => {
    html += `<li 
              class="row music-track list-group-item d-flex justify-content-between align-items-center"
              > 
              <div class="col-10">
                <i class="fas fa-music mr-2 text-secondary"></i>
                <b>${track.fileName}</b>
              </div>
              <div class="col-2">
                <i class="fas fa-play mr-3" data-id="${track.id}"></i>
                <i class="fas fa-trash-alt" data-id="${track.id}"></i>
              </div>
             </li>`
    return html
  }, '')
  let emptyTrackHTML = '<div class="alert alert-primart">还没有添加任何音乐</div>'
  tracksList.innerHTML = tracks.length ? `<ul class="list-group">${tracksListHTML}</ul>` : emptyTrackHTML
}

const renderPlayerHTML = (name, duration) => {
  let player = $('player-status')
  let html = `<div class="col font-weight-bold">
                正在播放：${name}
              </div>
              <div class="col">
                <span id="current-seeker">00:00</span>/${timeFormatter(duration)}
              </div>`
  player.innerHTML = html
}

const updateProgressHTML = (currentTime, duration) => {
  let seeker = $('current-seeker')
  let progress = currentTime / duration * 100
  let bar = $('player-progress')
  console.log(progress)
  seeker.innerHTML = timeFormatter(currentTime)
  bar.style.width = progress+'%'
}