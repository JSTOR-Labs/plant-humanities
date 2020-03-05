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
    watch: {
      settingsLoaded: {
        handler: function () {
          if (this.settingsLoaded) {
            let source
            const navMenuItem = this.navMenuItems.find(menuItem => menuItem.path === this.$route.path)
            if (navMenuItem) {
              this.$store.dispatch('setTitle', navMenuItem.path == '/' ? this.$store.getters.siteTitle : navMenuItem.title || this.$store.getters.siteTitle)
              this.$store.dispatch('setBanner', navMenuItem.banner || this.$store.getters.siteBanner)
              source = navMenuItem.source
            } else {
              source = `${this.$route.path}.md`
            }
            this.getStaticPage(source)
          }
        },
        immediate: true
      }

    }
  }
</script>
