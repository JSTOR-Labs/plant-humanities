import fs from 'fs'
import YAML from 'yaml'

const SETTINGS = YAML.parse(fs.readFileSync('./settings.yaml', 'utf8'))

const routerBase = {
  'GH_PAGES': { router: { base: ghPagesPath(SETTINGS.gh_path) } }
}[process.env.DEPLOY_ENV] || { router: { base: '/' } }

export default {
  env: { ...SETTINGS,
    deployEnv: process.env.DEPLOY_ENV || 'PROD',
    ve_service_endpoint: (process.env.DEPLOY_ENV || 'PROD') === 'DEV'
      ? 'http://localhost:5000'
      : 'https://us-central1-visual-essay.cloudfunctions.net'
  },
  ...routerBase,
  mode: 'spa',
  head: {
    title: SETTINGS.site_title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Visual Essays' }
    ],
    script: [
        { src: process.env.DEPLOY_ENV === 'DEV'
          ? 'http://localhost:8080/lib/visual-essays.js'
          : `https://jstor-labs.github.io/visual-essays/lib/visual-essays-${SETTINGS.visual_essays_version}.min.js` }
      ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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

function ghPagesPath(path) {
  const elems = path.split('/')
  return `/${elems[elems.length-1]}/`
}