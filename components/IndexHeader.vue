<template>
  <div ref="header" id="header" :class="`header ${essayConfig.layout === 'index' ? 'index' : 'essay'}`" :style="`height:${height}; background-image: url(${banner})`">
    <div id="do-labs"> 
    A collaboration between <i>JSTOR Labs</i> & <i>Dumbarton Oaks</i>
    </div>
    <div id="menuToggle" ref="menuToggle">
        <input type="checkbox" />
        <span></span>
        <span></span>
        <span></span>
        <ul id="menu">
          <li v-for="item in siteConfig.nav" :key="item.path" @click="nav(item.path)">
            <i :class="`fas fa-${item.icon}`"></i>{{item.label}}
          </li>
          <li>
            <a v-if="isAuthenticated" @click="logout"><i class="fas fa-user"></i>Logout</a>
            <a v-else :href="`/login?redirect=${href ? href.replace(/\/$/,'') : ''}`">
              <i class="fas fa-user"></i>Login
            </a>
          </li>
          <hr>
          <li style="margin-top:50px;" @click="viewMarkdown">
            <i class="fas fa-file-code"></i>View page markdown
          </li>
          <li v-if="isAuthenticated" @click="editMarkdown('stackedit')">
            <i class="fas fa-edit"></i>Edit page
          </li>
        </ul>
    </div>
    
    <div id="search" ref="search"> <i class="fal fa-search" style="font-size:32px; color:white;"></i> </div>

    <div id="logo" ref="logo"> <img src="https://jstor-labs.github.io/plant-humanities/images/ph-logo.png" height="50px">  </div>
    <div id="brand" ref="brand"> 
        <span class="brand-name">Plant Humanities</span> <br/>
        <span class="tagline" ref="tagline">Explore the cutural history of plants and their influence on human societies. </span>
    </div>
    
    <div class="title-bar">
      <div class="title" v-html="title"></div>
      <div class="author" v-html="author"></div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    name: 'PlantsIndexHeader',
    props: {
      essayConfig: { type: Object, default: function(){ return {}} },
      siteConfig: { type: Object, default: function(){ return {}} },
      progress: { type: Number, default: 0 },
      height: Number,
      appVersion: { type: String },
      libVersion: { type: String },
      isAuthenticated: { type: Boolean, default: false },
      href: String
    },    
    data: () => ({
      headerWidth: null,
      headerHeight: null,
      observer: null
    }),
    computed: {
      essayConfigLoaded() { return this.essayConfig !== null },
      banner() { return this.essayConfigLoaded ? (this.essayConfig.banner || this.siteConfig.banner) : null },
      bannerHeight() { return this.essayConfig && this.essayConfig.bannerHeight || this.siteConfig.bannerHeight || 400 },
      title() { return this.essayConfigLoaded ? (this.essayConfig.title || this.siteConfig.title) : null },
      author() { return (this.essayConfigLoaded && this.essayConfig.author) || '&nbsp;' },
      numMaps() { return (this.essayConfigLoaded && this.essayConfig['num-maps']) },
      numImages() { return (this.essayConfigLoaded && this.essayConfig['num-images']) },
      numSpecimens() { return (this.essayConfigLoaded && this.essayConfig['num-specimens']) },
      numPrimarySources() { return (this.essayConfigLoaded && this.essayConfig['num-primary-sources']) },
      hasStats() { return this.numMaps || this.numImages || this.numSpecimens || this.numPrimarySources }
    },
    mounted() {
      console.log(`${this.$options.name}.mounted: height=${this.height}`, this.siteConfig, this.essayConfig)
      console.log(`isAuthenticated=${this.isAuthenticated}`)

      // set initial height
      this.$refs.header.style.height = `${this.height}px`

      // initialize a header size observer
      this.initObserver()
    },
    methods: {
      initObserver() {
        const header = this.$refs.header, 
              vm = this,
              config = { attributes: true }

        // create the observer
        const observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            // check if the mutation is attributes and update the width and height data if it is.
            if (mutation.type === 'attributes') {
              let { width, height } = header.style
              vm.headerWidth = parseInt(width.replace(/px/, ''))
              vm.headerHeight = parseInt(height.replace(/px/, ''))
            }
          })
        })

        // observe element's specified mutations
        observer.observe(header, config)

        // add the observer to data so we can disconnect it later
        this.observer = observer
      },
      closeDrawer() {
        document.querySelector('#menuToggle input').checked = false
      },
      nav(item) {
        this.closeDrawer()
        console.log(`menuItemClicked=${item}`)
        this.$emit('menu-item-clicked', item)
      },
      logout(e) {
        e.preventDefault()
        this.closeDrawer()
        this.$emit('logout')
      },
      toggleOption(option) {
        this.closeDrawer()
        this.$emit('toggle-option', option)
      },
      collapseHeader() {
        this.closeDrawer()
        this.$emit('collapse-header')
      },
      viewMarkdown() {
        this.closeDrawer()
        this.$emit('view-markdown')
      },
      editMarkdown(editor) {
        this.closeDrawer()
        this.$emit('edit-markdown', editor)
      },
      openInfoboxModal() {
        this.closeDrawer()
        this.$emit('open-infobox-modal')
      },
      updateHeader() {
        /* Ron, I assume the 400 I've hardcoded here (and lots of other numbers) need to come from somewhere else 
        --Jessica*/
          
           this.$nextTick(() => {
                    
            //let attributionY = (400 - this.height) * -1 
            //this.$refs.header.style.top = ((attributionY >= -43) ? `${attributionY}px`: '-43px' ) //move "brought to you by" offscreen
            
            let percentScrolled = (400 - this.headerHeight) / 296 
            
            //make icons shorter
            let iconHeight = 21 + ((1 - percentScrolled) * 11) 
            this.$refs.search.style.height = `${iconHeight}px`
            this.$refs.logo.style.height = `${iconHeight}px`
            this.$refs.menuToggle.style.height = `${iconHeight}px`

            //move logo right and make it wider
            let logoMaxWidth = window.innerWidth - 80;
            let logoWidth = percentScrolled * logoMaxWidth
            if (logoWidth >= 40) {
                this.$refs.logo.style.width = `${logoWidth}px`
            } else { this.$refs.logo.style.width = '40px' }
            let logoX = 90 + (90 * percentScrolled)
            this.$refs.logo.style.left= `${logoX}px`

    
            //move search up and right
            let searchX = 90 * percentScrolled
            this.$refs.search.style.left = `${searchX}px`
            let searchY =  125 - (82 * percentScrolled)
            this.$refs.search.style.top = `${searchY}px`


            //move branding
            let brandX = percentScrolled * 160 + 90;
            this.$refs.brand.style.left = `${brandX}px`
            let brandY = 110 - percentScrolled * 80 
            this.$refs.brand.style.top = `${brandY}px`

            this.$refs.tagline.style.opacity = `${1-percentScrolled*2}` //have it fade out halfway through
        

        })
      }
    },
    beforeDestroy() {
      if (this.observer) this.observer.disconnect()
    },
    watch: {
      headerHeight() {
        this.updateHeader()
      },
      href() { 
        console.log('header.href', this.href)
      }
    }
  }
</script>

<style>

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
    min-height: 104px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    position: relative;
    margin: 0;
    background-color: white;
    color: #444;
  }

  .title-bar {
    display: grid;
    align-items: stretch;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    grid-template-areas: 
      "title"
      "author";
    color: white;
    background-color: rgba(0, 0, 0, .6);
    /*padding: 24px 0 0 70px;*/
    position: absolute;
    top: calc(100% - 104px);
    height: 104px;
    width: 100%;
    font-weight: bold;    
  }

  .title {
    grid: title;
    font-size: 2em;
    margin: 0 0 0 70px;
    padding: 22px 0 0 0;
  }
  .author {
    grid: author;
    font-size: 1.3em;
    margin: 0 0 0 70px;
    padding: 0 0 6px 0;
  }

  #menuToggle a {
    text-decoration: none;
    color: #000;
    transition: color 0.3s ease;
  }

  #menuToggle a:hover {
    color: #219653;
  }

  #menuToggle input {
    display: block;
    width: 40px;
    height: 32px;
    position: absolute;
    top: 20px;
    left: 20px;
    cursor: pointer;
    opacity: 0; /* hide this */
    z-index: 2; /* and place it over the hamburger */
    -webkit-touch-callout: none;
  }

  /*
  * Just a quick hamburger
  */
  #menuToggle span {
    display: block;
    width: 35px;
    height: 2px;
    margin-bottom: 8px;
    position: relative;
    background-color: white;
    border-radius: 3px;
    z-index: 1;
    transform-origin: 4px 0px;
    transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                opacity 0.55s ease;
  }

  #menuToggle span:first-child {
    transform-origin: 0% 0%;
  }

  #menuToggle span:nth-last-child(2) {
    transform-origin: 0% 100%;
  }

  /* 
  * Transform all the slices of hamburger
  * into a crossmark.
  */
  #menuToggle input:checked ~ span {
    opacity: 1;
    transform: rotate(45deg) translate(-2px, -1px);
    background: #232323;
  }

  /*
  * But let's hide the middle one.
  */
  #menuToggle input:checked ~ span:nth-last-child(3) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
  }

  /*
  * Ohyeah and the last one should go the other direction
  */
  #menuToggle input:checked ~ span:nth-last-child(2) {
    transform: rotate(-45deg) translate(0, -1px);
  }

  /*
  * Make this absolute positioned
  * at the top left of the screen
  */
  #menu {
    width: 230px;
    margin: -100px 0 0 -50px;
    padding: 120px 50px 10px 45px;
    background: #ededed;
    list-style-type: none;
    -webkit-font-smoothing: antialiased;
    /* to stop flickering of text in safari */
    transform-origin: 0% 0%;
    transform: translate(-100%, 0);
    transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  #menu li {
    display: flex;
    padding: 20px 0;
    font-size: 1.2em;
  }

  #menu li:hover {
    cursor: pointer;
    color: #1976d2;
  }

  #menu li svg {
    min-width: 1.5em;
    margin-right: 10px;
    margin-top: 3px;
    /* font-weight: bold; */
    font-size: 1em;
  }

  /*
  * And let's slide it in from the left
  */
  #menuToggle input:checked ~ ul {
    transform: none;
  }

  #menuToggle {
    display: block;
    position: relative;
    background-color: #323232;
    width: 40px;
    height: 32px;
    padding: 27px 25px 23px 25px;
    z-index: 1;
    -webkit-user-select: none;
    user-select: none;
  }

  .header .title-bar {
    display: none;
  }

  #do-labs {
      background-color: black;
      font-size: .8rem;
      padding: 14px;
      color: white;
      text-align: center;
      
  }

  #search {
      width: 40px;
      height: 32px;
      padding: 25px;
      background-color: #8E8E8E;
      position: absolute;
  }

  #logo {
      width: 40px;
      height: 32px;
      padding: 25px;
      background-color: #219653;
      position: absolute;
      top: 43px;
      left: 90px;
  }


  #brand {
    display: inline-block;
    position:absolute;
    top: 110px;
    left: 90px;
    padding: 20px;
    
  }

  .brand-name {
    font-family: 'Playfair Display', Serif;
    font-size: 3rem;
    color: white;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 0;
  }

  .tagline {
      font-size: 1.3rem;
      color: white;
      font-family: Roboto, Sans-serif;
      font-weight: 300;
  }

</style>
