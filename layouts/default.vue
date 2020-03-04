<template>
  <v-app>

    <v-navigation-drawer app v-model="drawer">
      <v-list dense>

        <v-list-item 
          nuxt
          v-for="page in pages" :key="page.path"
          @click="drawer=false"
          :to="page.path">
          <v-list-item-action>
            <v-icon>{{page.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>    
            <v-list-item-title>{{page.label}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

  <v-card tile class="overflow-hidden">
    <v-app-bar
      app
      prominent
      :height="bannerHeight"
      elevate-on-scroll
      fade-img-on-scroll
      absolute
      dark
      shrink-on-scroll
      :src="banner"
      scroll-target="#scrollableContent"
      scroll-threshold="200"
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
        <span>&nbsp;v{{ app_version }} ({{ bundle_version }})</span>
      </v-flex>
    </v-footer>

  </v-card>
  </v-app>
</template>

<script>

  export default {
    data: () => ({
      clipped: true,
      drawer: false,
      fixed: false,
      miniVariant: false,
      height: 600,
      bannerHeight: 600,
      essayTopMargin: 140,
      app_version: process.env.app_version,
      bundle_version: process.env.lib_version
    }),
    computed: {
      logMessages() { return this.$store.getters.logMessages },
      viewport() { return this.$store.getters.viewport },
      spacerHeight() { return this.$store.getters.spacerHeight },
      title() { return this.$store.getters.title || process.env.site_title },
      banner() { return this.$store.getters.banner || process.env.banner },
      pages() { return this.$store.getters.pages }
    },
    mounted() {
      this.bannerHeight = this.viewport.height * .25 
      this.essayTopMargin = this.bannerHeight
      this.height = this.viewport.height - this.bannerHeight - this.spacerHeight - 36
    },
    watch: {
      viewport: {
        handler: function (viewport) {
          if (viewport) {
            this.bannerHeight = this.viewport.height * .25 
            this.essayTopMargin = this.bannerHeight
            this.height = this.viewport.height - this.bannerHeight - this.spacerHeight - 36
          }
        },
        immediate: true
      }
    }
  }
</script>

<style>

  .v-navigation-drawer__border {
    display: none
  }
  .v-toolbar__title {
    font-size: 24px !important;
    font-weight: bold;
    padding-bottom: 4px !important;
  }

</style>
