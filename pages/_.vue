<template>
  <v-layout>
    <v-flex>
      <div :ref="$options.name" v-html="html"/>
    </v-flex>
  </v-layout>
</template>

<script>
import Mixin from './mixin'

  export default {
    name: 'all',
    mixins: [ Mixin ],
    mounted() {
      if (this.pages) {
        const page = this.pages.find(page => page.path === this.$route.path)
        this.$store.dispatch('setTitle', page.path == '/' ? this.$store.getters.siteTitle : page.title || this.$store.getters.siteTitle)
        this.$store.dispatch('setBanner', page.banner || this.$store.getters.defaultBanner)
        this.getStaticPage(page)
      }
    },
    watch: {
      pages() {
        const page = this.pages.find(page => page.path === this.$route.path)
        this.$store.dispatch('setTitle', page.path == '/' ? this.$store.getters.siteTitle : page.title || this.$store.getters.siteTitle)
        this.$store.dispatch('setBanner', page.banner || this.$store.getters.siteBanner)
        this.getStaticPage(page)
      }
    }
  }
</script>
