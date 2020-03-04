import Vue from 'vue'
import marked from 'marked'

const MarkedPlugin = {
  install: function (Vue, options) {
    Vue.prototype.$marked = marked
  }
}
Vue.use(MarkedPlugin)
