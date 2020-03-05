import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  baseUrl: undefined,
  markup: 'markdown',
  siteTitle: undefined,
  siteBanner: undefined,
  title: undefined,
  banner: undefined,
  navigation: undefined,
  html: undefined,
  viewport: null,
  spacerHeight: 0,
  appVersion: undefined,
  bundleVersion: undefined,
  settingsLoaded: false
}

const mutations = {
  setBaseUrl(state, baseUrl) { state.baseUrl = baseUrl },
  setMarkup(state, markup) { state.markup = markup },
  setSiteTitle(state, siteTitle) { state.siteTitle = siteTitle },
  setSiteBanner(state, siteBanner) { state.siteBanner = siteBanner },
  setTitle(state, title) { state.title = title },
  setBanner(state, banner) { state.banner = banner},
  setNavigation(state, navigation) { state.navigation = navigation },
  setHtml(state, html) { state.html = html },
  setViewport(state, viewport) { state.viewport = viewport },
  setSpacerHeight(state, height) { state.spacerHeight = height },
  setAppVersion(state, appVersion) { state.appVersion = appVersion },
  setBundleVersion(state, bundleVersion) { state.bundleVersion = bundleVersion },
  setSettingsLoaded(state, loaded) { state.settingsLoaded = loaded }
}

const actions = {
  nuxtServerInit(vuexContext, context) {
    // console.log('nuxtServerInit')
  },
  setBaseUrl: ({ commit }, baseUrl) => commit('setBaseUrl', baseUrl),
  setMarkup: ({ commit }, markup) => commit('setMarkup', markup),
  setViewport: ({ commit }, viewport) => commit('setViewport', viewport),
  setSiteTitle: ({ commit }, siteTitle) => commit('setSiteTitle', siteTitle),
  setSiteBanner: ({ commit }, siteBanner) => commit('setSiteBanner', siteBanner),
  setTitle: ({ commit }, title) => commit('setTitle', title),
  setBanner: ({ commit }, banner) => commit('setBanner', banner),
  setNavigation: ({ commit }, navigation) => commit('setNavigation', navigation),
  setHtml: ({ commit }, html) => commit('setHtml', html),
  setSpacerHeight: ({ commit }, height) => commit('setSpacerHeight', height),
  setAppVersion: ({ commit }, appVersion) => commit('setAppVersion', appVersion),
  setBundleVersion: ({ commit }, bundleVersion) => commit('setBundleVersion', bundleVersion),
  setSettingsLoaded: ({ commit }, loaded) => commit('setSettingsLoaded', loaded)
}

const getters = {
  baseUrl: state => state.baseUrl,
  markup: state => state.markup,
  siteTitle: state => state.siteTitle,
  siteBanner: state => state.siteBanner,
  title: state => state.title,
  banner: state => state.banner,
  navigation: state => state.navigation,
  html: state => state.html,
  viewport: state => state.viewport,
  spacerHeight: state => state.spacerHeight,
  appVersion: state => state.appVersion,
  bundleVersion: state => state.bundleVersion,
  settingsLoaded: state => state.settingsLoaded
}

export default () => new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
