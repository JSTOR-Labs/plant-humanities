export default ({ app }, inject) => {
    app.store.dispatch('setBaseUrl', window.location.hostname === 'localhost' ? window.location.origin : process.env.baseurl )
    console.log('baseUrl', app.store.getters.baseUrl)
    app.store.dispatch('setMarkup', process.env.markup || 'markdown')
    app.store.dispatch('setPages', process.env.pages )
    console.log('pages', app.store.getters.pages)
  }