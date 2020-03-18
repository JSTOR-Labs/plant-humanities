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
      navMenuItems() { return this.$store.getters.navigation || [] },
      settingsLoaded() { return this.$store.getters.settingsLoaded },
    },
    methods: {
      getPage(route) {
        const scrollable = document.getElementById('scrollableContent') || window
        scrollable.scrollTo(0, 0)
        window.data = undefined
        const menuItem = this.navMenuItems.find(navMenuItem => route.path === navMenuItem.path) || {}
        console.log('getPage', route, this.navMenuItems, menuItem)
        const path = route.path === '/' ? '/index' : route.path.replace(/\/essay\//,'/')
        const mdSource = menuItem.source || path

        const scrollToElemId = route.hash.length > 1 ? route.hash.slice(1) : undefined

        const contentUrl = mdSource.indexOf('http') === 0 ? mdSource : `${this.baseUrl}/content${mdSource}.md`
        this.$store.dispatch('setMarkdownSource', contentUrl)
        console.log(`contentUrl=${contentUrl}`)
        let serviceUrl = `${process.env.ve_service_endpoint}/essay?src=${encodeURIComponent(contentUrl)}&nocss`
        if (process.env.context) {
          serviceUrl += `&context=${process.env.context}`
        }
        axios.get(serviceUrl)
          .then(resp => this.$store.dispatch('setHtml', resp.data))
          .then(_ => {
            console.log('waiting for visual-essays.init')
            this.onLoaded(path, scrollToElemId)
          })
      },
      onLoaded(path, scrollToElemId) {
        const veElem = document.getElementById('visual-essay')
        if (veElem) {        
          this.updateLinks()
          if (scrollToElemId) {
            this.scrollToElem(scrollToElemId)
          }
          const _this = this
          new ResizeSensor(veElem, function() {
            const essaySpacer = document.getElementById('essay-spacer')
            _this.$store.dispatch('setSpacerHeight', essaySpacer ? essaySpacer.clientHeight : 0)
          })
          this.setPageMetadata(path)
        } else {
          setTimeout(() => { this.onLoaded(path, scrollToElemId) }, 250)
        }
      },
      setPageMetadata(path) {
        const menuItem = this.navMenuItems.find(navMenuItem => path === navMenuItem.path) || {}
        const essayConfig = window.data.find(item => item.type === 'essay') || {}
        this.$store.dispatch('setTitle', essayConfig.title || menuItem.title || this.$store.getters.siteTitle)
        this.$store.dispatch('setBanner', essayConfig.banner || menuItem.banner || this.$store.getters.siteBanner)
      },
      updateLinks() {
        // console.log('updateLinks')
        if (this.$refs[this.$options.name]) {
          this.$refs[this.$options.name].querySelectorAll('a').forEach((link) => {
            if (link.href) {
              const parsedUrl = parseUrl(link.href)
              console.log(parsedUrl)
              // if (this.navPaths.has(parsedUrl.pathname) || parsedUrl.pathname.indexOf('/essay/') === 0) {
              if (this.baseUrl.indexOf(parsedUrl.origin) === 0 && !parsedUrl.hash) {
                console.log('remove')
                link.removeAttribute('href')
                link.addEventListener('click', (e) => {
                  this.$router.push({
                    path: parsedUrl.pathname,
                    query: parseQueryString(parsedUrl.search),
                    hash: parsedUrl.hash
                  })
                }) 
              }
            }
          })
          this.$refs[this.$options.name].querySelectorAll('img').forEach((img) => {
            const parsedImgUrl = parseUrl(img.src)
            if (parsedImgUrl.pathname.indexOf('/images/') === 0 && this.baseUrl.indexOf(parsedImgUrl.origin === 0)) {
              img.src = `${this.baseUrl}${parsedImgUrl.pathname}`
            }
          })
        }
      },
      scrollToElem(elemId) {
        const scrollToElem = document.getElementById(elemId)
        if (scrollToElem) {
          const header = document.querySelector('header')
          // const scrollTo = scrollToElem.offsetTop - (header ? header.offsetHeight : 0)
          const scrollTo = scrollToElem.offsetTop + 140
          const scrollable = document.getElementById('scrollableContent') || window
          console.log('scrollTo', scrollable, scrollToElem, scrollTo)
          scrollable.scrollTo(0, scrollTo)
        }
      },
      /*onLoaded(scrollToElemId) {
        const essayElem = document.getElementById('visual-essay')
        console.log('onLoaded', essayElem)
        if (essayElem) {              
          this.updateLinks()
          if (scrollToElemId) {
            this.scrollToElem(scrollToElemId)
          }
          const _this = this
          new ResizeSensor(essayElem, function() {
            const essaySpacer = document.getElementById('essay-spacer')
            _this.$store.dispatch('setSpacerHeight', essaySpacer ? essaySpacer.clientHeight : 0)
          })
          // window.scrollTo(0, 0)
          // get essay metadata
          

          if (!window.data) {
            const jsonld = essayElem.querySelectorAll('script[type="application/ld+json"]')
            if (jsonld.length > 0) {
              jsonld.forEach((scr) => {
                eval(scr)
              })
            }
          }

          this.addEssayMetadata()
        } else {
          setTimeout(() => { this.onLoaded(scrollToElemId) }, 250)
        }
      },
      addEssayMetadata() {
        if (window.data) {
          window.data.forEach((item) => {
            if (item.type === 'essay') {
              if (item.title) {
                this.$store.dispatch('setTitle', item.title)
              }
              if (item.banner) {
                const imageUrl = item.banner.indexOf('/images/') === 0 ? `${this.baseUrl}${item.banner}` : item.banner
                this.$store.dispatch('setBanner', imageUrl)
              }          
            }
          })
        } else {
          setTimeout(() => { this.addEssayMetadata() }, 1000)
        }
      }
      */
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

function parseQueryString(queryString) {
    queryString = queryString || window.location.search
    const dictionary = {}
    try {
      if (queryString.indexOf('?') === 0) {
        queryString = queryString.substr(1)
      }
      const parts = queryString.split('&')
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        const keyValuePair = p.split('=')
        if (keyValuePair[0] !== '') {
          const key = keyValuePair[0]
          if (keyValuePair.length === 2) {
            let value = keyValuePair[1]
            // decode URI encoded string
            value = decodeURIComponent(value)
            value = value.replace(/\+/g, ' ')
            dictionary[key] = value
          } else {
            dictionary[key] = 'true'
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
    return dictionary
}