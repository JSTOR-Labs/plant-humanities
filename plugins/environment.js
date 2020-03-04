export default ({ app }, inject) => {
  
    const viewport = {
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    }
    app.store.dispatch('setViewport', viewport )
  
    let rtime
    let timeout = false
    const delta = 200
  
    function resizeend() {
      if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta)
      } else {
        timeout = false
        const viewport = {
          height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
          width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        }
        app.store.dispatch('setViewport', viewport )
      }
    }
  
    window.addEventListener('resize', () => {
      rtime = new Date()
      if (timeout === false) {
        timeout = true
        setTimeout(resizeend, delta)
      }
    })
  
  }