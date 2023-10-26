
<template>

  <div ref="header" id="header-component" class="header" :style="containerStyle">

      <div class="title-bar" style="display:flex; align-items:center;">
        <div style="display:flex; flex-direction: column; align-items: start;">
          <div class="title" v-html="title"></div>
          <div class="author" v-html="author || tagline"></div>
        </div>

        <ve-menu style="margin-left:auto;margin-right:1rem;">
          <ul>
            <li v-for="(navItem, idx) in nav" :key="`nav=${idx}`"> 
              <a :href="navItem.href"><svg v-if="navItem.icon" v-html="navItem.icon"></svg> {{  navItem.label }}</a>
            </li>
          </ul>
        </ve-menu>
    
    </div>
    
  </div>
</template>

<script>

  module.exports = {
    name: 've1-header',
    props: {
      viewerIsActive: { type: Boolean, default: true },
      path: { type: String, default: '/' },
      scrollTop: { type: Number, default: 0 },
      essayConfig: { type: Object, default: () => ({}) },
      siteConfig: { type: Object, default: () => ({}) },
      isJuncture: { type: Boolean, default: false },
      isAuthenticated: { type: Boolean, default: false },
      isAdmin: { type: Boolean, default: false },
      doActionCallback: { type: Object, default: () => ({}) },
      loginsEnabled: { type: Boolean, default: false },
      contentSource: { type: Object, default: () => ({}) },
      version: { type: String, default: '' },
    },    
    data: () => ({
      nav: [],
      dependencies: [],
      doActionResponse: {},

      // for contact-us email
      contactName: null,
      contactEmail: null,
      contactMessage: null
    }),    
    computed: {
      containerStyle() { return  this.banner && { 
        height: this.viewerIsActive ? `${this.scrollTop < 400 ? 400 - this.scrollTop : 0}px` : '0',
        backgroundColor: 'white',
        backgroundImage: `url(${this.banner})`
      } },
      banner() { return this.essayConfig !== null ? (this.essayConfig.banner || this.siteConfig.banner || 'https://picsum.photos/id/857/1000/400') : null },
      title() { return this.essayConfig !== null ? this.essayConfig.title || this.siteConfig.title : ''},
      tagline() { return this.essayConfig !== null ? this.siteConfig.tagline : null },
      author() { return this.essayConfig !== null ? this.essayConfig.author : null },
      isGHP() { return location.hostname.indexOf('github.io') > 0 },
      baseUrl() { return this.isGHP ? `/${location.pathname.split('/')[1]}` : '' }
    },
    mounted() {
      this.nav = window?.config?.nav || []
      this.loadDependencies(this.dependencies, 0, this.init) 
    },
    methods: {
      init() {},
    },
    watch: {
      doActionCallback(resp) { this.doActionResponse = resp },
    }
  }
</script>

<style scoped>

  [v-cloak] { display: none; }

  body {
    margin: 0;
    padding: 0;
    background-color: white;
    color: #444;
  }

  .header {
    font-family: Roboto, sans-serif;
    font-size: 1rem;
    min-height: 90px;
    height: 400px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    position: relative;
    margin: 0;
    color: #444;
  }

  ve-menu1 {
    z-index: 1000;
    margin-left: auto;
    margin-right: 2rem;
    justify-self: center;
  }

  .title-bar {
    /*
    display: grid;
    align-items: stretch;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: 
      "title"
      "author";
    */
    color: white;
    background-color: rgba(0, 0, 0, .6);
    /* padding-top: 14px; */
    position: absolute;
    top: calc(100% - 100px);
    height: 100px;
    width: 100%;
    font-weight: bold;
  }

  .title {
    grid-area: title;
    font-size: min(8vw, 2.2em);
    margin: 0 0 0 22px;
    padding: 10px 0 0 50px;
  }
  .author {
    grid-area: author;
    font-size: min(6vw, 1.3em);
    margin: -6px 0 0 22px;
    padding: 0 0 6px 50px;
    /* align-self: center; */
  }

  .version {
    font-size: 0.9rem;
  }

  .subtitle {
    font-size: 1.1rem;
    font-weight: bold;
  }

</style>