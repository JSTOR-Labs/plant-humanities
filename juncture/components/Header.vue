
<template>

  <div ref="header" id="header-component" class="header" :style="containerStyle">

      <div class="title-bar" style="display:flex; align-items:center;">
        <div style="display:flex; flex-direction: column; align-items: start;">
          <div class="title" v-html="title"></div>
          <div class="author" v-html="author || tagline"></div>
        </div>

        <ve-menu1 style="">
          <ul>
            <li><a href="/">        
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>
                Home
            </a></li>
            <li><a href="/about">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                About
            </a></li>
            <li><a href="/contributors">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
                Contributors
            </a></li>
            <li><a href="https://search.plant-humanities.org">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                Search
            </a></li>
            <li><a href="/contact">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
                Contact Us
            </a></li>
          </ul>
        </ve-menu1>
    
    </div>
    
  </div>
</template>

<script>
  const defaultBanner = 'https://picsum.photos/id/403/1000/400?blur=1'

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
      title() { return this.essayConfig !== null ? this.essayConfig.title || this.siteConfig.title : 'Juncture'},
      tagline() { return this.essayConfig !== null ? this.siteConfig.tagline : null },
      author() { return this.essayConfig !== null ? this.essayConfig.author : null },
      isGHP() { return location.hostname.indexOf('github.io') > 0 },
      baseUrl() { return this.isGHP ? `/${location.pathname.split('/')[1]}` : '' }
    },
    mounted() { this.loadDependencies(this.dependencies, 0, this.init) },
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
    margin-right: 1rem;
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