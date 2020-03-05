import axios from 'axios'
import YAML from 'yaml'

export default ({ app }, inject) => {
  console.log(window.location, process.env.router.base)
  const baseUrl = window.location.hostname === 'localhost'
    ? window.location.origin
    : `${window.location.origin}${process.env.router.base.slice(0,process.env.router.base.length-1)}`
  app.store.dispatch('setBaseUrl', baseUrl )
  const settingsUrl = `${baseUrl}/settings.yaml`
  console.log('settingsUrl', settingsUrl)
  axios.get(settingsUrl)
    .then(resp => resp.data)
    .then(yaml => {
      const settings = YAML.parse(yaml)
      console.log('settings', settings)
      document.title = settings.title
      app.store.dispatch('setSiteTitle', settings.title )
      app.store.dispatch('setSiteBanner', settings.banner )
      app.store.dispatch('setNavigation', settings.navigation )
      app.store.dispatch('setAppVersion', settings.app_version )
      app.store.dispatch('setBundleVersion', settings.lib_version )
      app.store.dispatch('setSettingsLoaded', true )
    })
  }