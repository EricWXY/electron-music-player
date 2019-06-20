const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const DataStore = require('./store')

const Store = new DataStore({
  'name': 'Music Data'
})

class AppWindow extends BrowserWindow {

  constructor(config, filePath) {
    let basiConfig = {
      width: 800,
      height: 600,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true
      },
      show: false
    }
    let finalConfig = { ...basiConfig, ...config }// let finalConfig = Object.assign(basiConfig, config)
    super(finalConfig)
    this.loadFile(filePath)
    this.once('ready-to-show', () => {
      this.show()
    })

  }

}

app.on('ready', () => {
  let mainWindow = new AppWindow({}, './template/index.html')
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.send('update-tracks', Store.getTracks())
  })

  ipcMain.on('add-music-window', () => {
    let addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow
    }, './template/add.html')

    addWindow.on('close', () => {
      delete addWindow
    })

  })

  ipcMain.on('open-music-file', event => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Music', extensions: ['mp3'] }]
    }, files => {
      if (files) {
        event.sender.send('selected-file', files)
      }
    })
  })

  ipcMain.on('dialog-add-empty', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '温馨提示',
      message: '没有选择任何歌曲...\n\r请选择你喜欢的本地歌曲'
    })
  })

  ipcMain.on('add-tracks', ({ }, tracks) => {
    let updateTracks = Store.addTracks(tracks).getTracks()
    mainWindow.send('update-tracks', updateTracks)
  })

  ipcMain.on('delete-track', ({ }, id) => {
    let updateTracks = Store.deleteTrack(id).getTracks()
    mainWindow.send('update-tracks', updateTracks)
  })

})