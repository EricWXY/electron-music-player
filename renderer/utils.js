exports.$ = id => {
  return document.getElementById(id)
}

exports.timeFormatter = time => {
  let minutes = '0' + Math.floor(time / 60)
  let seconds = '0' + Math.floor(time - minutes * 60)
  return minutes.substr(-2) + ':' + seconds.substr(-2)
}