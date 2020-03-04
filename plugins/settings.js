import axios from 'axios'
import YAML from 'yaml'

export default ({ app }, inject) => {
  console.log(window.location)
  const settingsUrl = `${window.location.href}settings.yaml`
  console.log('settingsUrl', settingsUrl)
  axios.get(settingsUrl)
    .then(resp => resp.data)
    .then(yaml => {
      const settings = YAML.parse(yaml)
      console.log('settings', settings)
      document.title = settings.title
      app.store.dispatch('setSiteTitle', settings.title )
      app.store.dispatch('setSiteBanner', settings.banner )
      app.store.dispatch('setBaseUrl', window.location.hostname === 'localhost' ? window.location.origin : settings.baseurl )
      app.store.dispatch('setPages', settings.pages )
      app.store.dispatch('setBundleVersion', settings.lib_version )
    })
  }