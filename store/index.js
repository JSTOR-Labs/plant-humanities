import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  baseUrl: undefined,
  markup: 'markdown',
  title: undefined,
  banner: undefined,
  html: undefined,
  pages: {},
  viewport: null,
  spacerHeight: 0
}

const mutations = {
  setBaseUrl(state, baseUrl) { state.baseUrl = baseUrl },
  setMarkup(state, markup) { state.markup = markup },
  setTitle(state, title) { state.title = title },
  setBanner(state, banner) { state.banner = banner },
  setHtml(state, html) { state.html = html },
  setPages(state, pages) { state.pages = pages },
  setViewport(state, viewport) { state.viewport = viewport },
  setSpacerHeight(state, height) { state.spacerHeight = height }
}

const actions = {
  nuxtServerInit(vuexContext, context) {
    // console.log('nuxtServerInit')
  },
  setBaseUrl: ({ commit }, baseUrl) => commit('setBaseUrl', baseUrl),
  setMarkup: ({ commit }, markup) => commit('setMarkup', markup),
  setViewport: ({ commit }, viewport) => commit('setViewport', viewport),
  setTitle: ({ commit }, title) => commit('setTitle', title),
  setBanner: ({ commit }, banner) => commit('setBanner', banner),
  setHtml: ({ commit }, html) => commit('setHtml', html),
  setPages: ({ commit }, pages) => commit('setPages', pages),
  setSpacerHeight: ({ commit }, height) => commit('setSpacerHeight', height)
}

const getters = {
  baseUrl: state => state.baseUrl,
  markup: state => state.markup,
  title: state => state.title,
  banner: state => state.banner,
  pages: state => state.pages,
  html: state => state.html,
  viewport: state => state.viewport,
  spacerHeight: state => state.spacerHeight
}

export default () => new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
