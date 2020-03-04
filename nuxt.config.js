const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES'
  ? { router: { base: '/mysite/' } } 
  : { router: { base: '/' } }

export default {
  env: {
    ...routerBase,
    deployEnv: process.env.DEPLOY_ENV || 'PROD',
    ve_service_endpoint: (process.env.DEPLOY_ENV || 'PROD') === 'DEV'
      ? 'http://localhost:5000'
      : 'https://us-central1-visual-essay.cloudfunctions.net'
  },
  ...routerBase,
  mode: 'spa',
  head: {
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Visual Essays' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${routerBase.router.base}favicon.ico` }
    ]
  },
  plugins: [
    { src: '@/plugins/environment.js', ssr: false },
    { src: '@/plugins/marked.js', ssr: false },
    { src: '@/plugins/settings.js', ssr: false }
  ],
  buildModules: [
    '@nuxtjs/vuetify'
  ],
  modules: [
    '@nuxtjs/axios',
  ],
  generate: {
    dir: 'docs',
    fallback: true,
  }
}
