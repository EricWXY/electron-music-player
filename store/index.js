const Store = require('electron-store')
const uuidv4 = require('uuid/v4')
const path = require('path')

class DataStore extends Store {
  constructor(settings) {
    super(settings)
    this.tracks = this.get('tracks') || []
  }

  saveTracks() {
    this.set('tracks', this.tracks)
    return this
  }

  getTracks() {
    return this.get('tracks') || []
  }

  addTracks(tracks) {
    let tracksWithProps = tracks.map(item => ({
      id: uuidv4(),
      path: item,
      fileName: path.basename(item)
    })).filter(item => {
      let currentTracksPath = this.getTracks().map(track => track.path)
      return currentTracksPath.indexOf(item.path) < 0
    })
    this.tracks = [...this.tracks, ...tracksWithProps]
    return this.saveTracks()
  }

  deleteTrack(id) {
    this.tracks = this.tracks.filter(item => item.id !== id)
    return this.saveTracks()
  }

}

module.exports = DataStore