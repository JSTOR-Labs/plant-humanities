import axios from 'axios'
import ResizeSensor from 'resize-sensor'

export default {
    name: 'main-mixin',
    data: () => ({
      essay: undefined
    }),
    computed: {
      html() { return this.$store.getters.html },
      baseUrl() { return this.$store.getters.baseUrl },
      staticPagePaths() {
        const paths = new Set()
        this.$store.getters.pages.forEach(page => paths.add(page.path))
        console.log(paths)
        return paths
      }
    },
    created() {
      this.$store.dispatch('setTitle', process.env.site_title)
      this.$store.dispatch('setBanner', process.env.banner_image)
    },
    methods: {
      getStaticPage(page) {
        const pageUrl = page.source.indexOf('http') === 0 ? page.source : `${this.baseUrl}/${page.source}`
        console.log(`getStaticPage=${pageUrl}`)
        return axios.get(pageUrl)
          .then(resp => this.$marked(resp.data))
          .then((html) => {
            this.$store.dispatch('setHtml', html)
            this.$nextTick(() => { this.updateLinks() })
          })
      },
      updateLinks() {
        console.log('updateLinks', this.$options.name)
        if (this.$refs[this.$options.name]) {
          this.$refs[this.$options.name].querySelectorAll('a').forEach((link) => {
            if (link.href) {
              const parsedUrl = parseUrl(link.href)
              if (this.staticPagePaths.has(parsedUrl.pathname) || parsedUrl.pathname.indexOf('/essay/') === 0) {
                link.removeAttribute('href')
                link.addEventListener('click', (e) => {
                  this.$router.push(parsedUrl.pathname)
                }) 
              }
            }
          })
          this.$refs[this.$options.name].querySelectorAll('img').forEach((img) => {
            console.dir(img)
            const parsedImgUrl = parseUrl(img.src)
            console.log('parsedImgUrl', parsedImgUrl)
            if (parsedImgUrl.pathname.indexOf('/images/') === 0 && this.baseUrl.indexOf(parsedImgUrl.origin === 0)) {
              img.src = `${this.baseurl}${parsedImgUrl.pathname}`
            }
          })
        }
      },
      getEssay(src) {
        window.data = undefined
        let url = `${process.env.ve_service_endpoint}/essay?src=${encodeURIComponent(src)}&nocss`
        if (process.env.context) {
          url += `&context=${process.env.context}`
        }
        axios.get(url)
          .then(resp => this.essay = resp.data)
          .then(_ => this.onLoaded())
      },
      onLoaded() {
        const essayElem = document.getElementById('visual-essay')
        console.log('onLoaded', essayElem)
        if (essayElem) {
          const _this = this
          new ResizeSensor(essayElem, function() {
            const essaySpacer = document.getElementById('essay-spacer')
            _this.$store.dispatch('setSpacerHeight', essaySpacer ? essaySpacer.clientHeight : 0)
          })
          // get essay metadata
          console.log('onLoaded', window.data)
          if (!window.data) {
            const jsonld = essayElem.querySelectorAll('script[type="application/ld+json"]')
            if (jsonld.length > 0) {
              jsonld.forEach((scr) => {
                eval(scr)
              })
            }
          }
          this.addMetadata()
          this.updateLinks()
        } else {
          setTimeout(() => { this.onLoaded() }, 1000)
        }
      },
      addMetadata() {
        if (window.data) {
          window.data.forEach((item) => {
            if (item.type === 'essay') {
              if (item.title) {
                this.$store.dispatch('setTitle', item.title)
              }
              if (item.banner) {
                this.$store.dispatch('setBanner', item.banner)
              }          }
          })
        } else {
          setTimeout(() => { this.addMetadata() }, 1000)
        }
      }
    }
  }
  
function parseUrl (href) {
    const match = href.match(/^(https?)\:\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/)
    return match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      origin: `${match[1]}://${match[2]}`,
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7]
    }
  }