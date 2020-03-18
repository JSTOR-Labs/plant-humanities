<template>
  <v-app>

      <v-navigation-drawer app v-model="drawer">
        <v-list dense>

          <v-list-item
            nuxt
            v-for="menuItem in navigation" :key="menuItem.path"
            @click="drawer=false"
            :to="menuItem.path">
            <v-list-item-action>
              <v-icon>{{menuItem.icon}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{menuItem.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-navigation-drawer>

    <v-card tile class="overflow-hidden">
      <v-app-bar
        ref="appbar"
        app
        prominent
        :height="bannerHeight"
        elevate-on-scroll
        fade-img-on-scroll
        dark
        shrink-on-scroll
        :src="banner"
        scroll-target="#scrollableContent"
        :scroll-threshold="scrollThreshold"
      >
        <template v-slot:img="{ props }">
          <v-img v-bind="props"/>
        </template>

        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

        <v-toolbar-title>{{title}}</v-toolbar-title>

        <v-spacer></v-spacer>

      </v-app-bar>

      <v-sheet
        id="scrollableContent"
        class="overflow-y-auto"
      >
        <v-container ref="contentContainer" :style="`margin-top: ${essayTopMargin}px; height: ${height}px;`">
          <nuxt/>
        </v-container>

      </v-sheet>

      <v-footer ref="footer" :fixed="fixed" app>
        <v-flex class="text-xs-left">
          <span>&nbsp;v{{ appVersion }} ({{ bundleVersion }})</span>
          <span style="float:right;cursor:pointer" @click="toggleShowMarkdown" title="Show markdown source">
            <v-icon>mdi-code-tags</v-icon>
          </span>
        </v-flex>
      </v-footer>

    </v-card>
    <markdown-viewer/>
  </v-app>
</template>

<script>
  import MarkdownViewer from '../components/MarkdownViewer'

  export default {
    components: {
      MarkdownViewer
    },
    data: () => ({
      clipped: true,
      drawer: false,
      fixed: false,
      miniVariant: false,
      height: 600,
      bannerHeight: 600,
      essayTopMargin: 140,
      app_version: process.env.app_version,
      scrollThreshold: 160,
      header: undefined,
      viewer: undefined,
      viewerPosition: undefined
    }),
    computed: {
      viewport() { return this.$store.getters.viewport },
      spacerHeight() { return this.$store.getters.spacerHeight },
      title() { return this.$store.getters.title || this.$store.getters.siteTitle },
      banner() { return this.$store.getters.banner },
      navigation() { return this.$store.getters.navigation },
      appVersion() { return this.$store.getters.appVersion },
      bundleVersion() { return this.$store.getters.bundleVersion }
    },
    mounted() {
      this.bannerHeight = this.viewport.height * .25
      this.essayTopMargin = this.bannerHeight
      this.height = this.viewport.height - this.bannerHeight - this.spacerHeight - 36
      console.log(`layout: viewport.height=${this.viewport.height} bannerHeight=${this.bannerHeight} essayTopMargin=${this.essayTopMargin} height=${this.height}`)
      this.header = document.querySelector('header')
      document.getElementById('scrollableContent').addEventListener('scroll', this.throttle(this.mouseMove, 100))
    },
    methods: {
      throttle(callback, interval) {
        let enableCall = true

        return function(...args) {
          if (!enableCall) return
          enableCall = false
          callback.apply(this, args)
          setTimeout(() => enableCall = true, interval)
        }
      },
      mouseMove(e) {
        this.viewer = document.getElementById('viewer')
        if (this.viewer) {
          if (!this.viewerPosition) {
            this.viewerPosition = 'relative'
            this.viewer.style.top = '0px'
            this.viewer.style.position = 'relative'
          } else {
            if (this.header.offsetHeight === 56 && this.viewerPosition === 'relative') {
              this.viewer.style.top = '56px'
              this.viewer.style.position = 'fixed'
              this.viewerPosition = 'fixed'
              console.log(`viewer: position=${this.viewer.style.position}`)
            } else if (this.viewerPosition === 'fixed' && this.header.offsetHeight > 56) {
              this.viewer.style.top = '0px'
              this.viewer.style.position = 'relative'
              this.viewerPosition = 'relative'
              console.log(`viewer: position=${this.viewer.style.position}`)
            }
          }
        }
        // .style.top = `${document.querySelector('header').offsetHeight + 24}px`
      },
      toggleShowMarkdown() {
        this.$store.dispatch('setShowMarkdown', !this.$store.getters.showMarkdown)
        console.log(`showMarkdown=${this.$store.getters.showMarkdown}`)
      }
    },
    watch: {
      viewport: {
        handler: function (viewport) {
          if (viewport) {
            this.bannerHeight = this.viewport.height * .25
            this.essayTopMargin = this.bannerHeight
            // this.height = this.viewport.height - this.bannerHeight - this.spacerHeight - 36
            console.log(`viewport: bannerHeight=${this.bannerHeight} essayTopMargin=${this.essayTopMargin} height=${this.height}`)
          }
        },
        immediate: true
      },
      bundleVersion: {
        handler: function (bundleVersion) {
          if (bundleVersion) {
            const libJS = document.createElement('script')
            libJS.setAttribute('src', window.location.hostname === 'localhost'
              ? 'http://localhost:8080/lib/visual-essays.js'
              : `https://jstor-labs.github.io/visual-essays/lib/visual-essays-${bundleVersion}.min.js`)
            document.body.appendChild(libJS)
          }
        },
        immediate: true
      }
    }
  }

</script>

<style>

  .v-footer {
    border-top: 1px solid #9b9b9b !important;
  }

  .container {
    padding: 0 !important;
    max-width: 1500px !important;
  }

  .v-toolbar, .v-footer, .v-navigation-drawer {
    z-index: 200 !important;
  }

  .v-navigation-drawer {
    z-index: 201 !important;
  }

  .v-navigation-drawer__border {
    display: none
  }
  .v-toolbar__title {
    font-size: 24px !important;
    font-weight: bold;
    padding-bottom: 4px !important;
  }
  .v-application code {
    color: #000;
    font-weight: normal;
  }


  .leaflet-container {
    background: #aad3df !important;
  }

  .leaflet-bar a, .leaflet-bar a:hover {
    height: 30px !important;
    width: 36px !important;
  }

  #cards-image-viewer .container{
    margin-bottom: 172px !important;
  }


</style>
