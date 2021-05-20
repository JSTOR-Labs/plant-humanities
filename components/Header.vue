
<template>
<!--
  <div ref="header" id="header" class="header" :style="containerStyle">
    <nav>
      <div id="menuToggle">
        <input type="checkbox" />
        <span></span>
        <span></span>
        <span></span>
        <ul id="menu">
          <li @click="nav('/')">
            <i :class="`fas fa-home`"></i>Home!
          </li>
          <template v-for="item in siteConfig.nav">
            <li :key="item.path" @click="nav(item.path)">
              <i :class="`fas fa-${item.icon}`"></i>{{item.label}}
            </li>
          </template>

          <template v-if="isJuncture">
            <hr>

            <li v-if="loginsEnabled">
              <a v-if="isAuthenticated" @click="logout">
                <i :class="`fas fa-user`"></i>Logout
              </a>
              <a v-else @click="authenticate">
                <i :class="`fas fa-user`"></i>Login
              </a>
            </li>

            <li v-if="isAuthenticated" @click="nav('viewMarkdown')">
              <i class="fas fa-file-code"></i>View page markdown
            </li>
            <li v-if="isAuthenticated && ((contentSource.acct !== 'jstor-labs' && contentSource.repo !== 'juncture')|| isAdmin)" @click="nav('editMarkdown')">
              <i class="fas fa-edit"></i>Edit this page
            </li>
            <li v-if="isAuthenticated && ((contentSource.acct !== 'jstor-labs' && contentSource.repo !== 'juncture')|| isAdmin)" @click="nav('addPage')">
              <i class="fas fa-file-medical"></i>Add a page
            </li>
            <li v-if="isAuthenticated" @click="nav('gotoGitHub')">
              <i class="fab fa-github"></i>Goto to GitHub
            </li>
                        
            <hr>
            <li v-if="isAuthenticated" @click="nav('createSite')">
              <i class="fas fa-plus-circle"></i>Create new site
            </li>
            <li v-if="isAdmin" @click="nav('updateSite')">
              <i class="fas fa-wrench"></i>Software update
            </li>

          </template>

          <li v-if="version">
            <br>
            <div class="version">Version: {{version}}</div>
          </li>
        </ul>
      </div>
    </nav>

    <div class="title-bar">
      <div class="title" v-html="title"></div>
      <div class="author" v-html="author"></div>
    </div>

  </div>
-->

<div>
<!--  <div id="do-labs"> A collaboration between <i>JSTOR Labs</i> & <i>Dumbarton Oaks</i></div>-->
    <div :class="`header ${essayConfig.layout === 'index' ? 'index' : 'essay'}`" :style="`background-image: url(${banner})`" id="header" ref="header">
      <div class="homepage-header">

        <div id="logo" ref="logo">
          <img
            src="https://jstor-labs.github.io/plant-humanities/images/phl-website-png-logo.png"
            xlink:href="https://jstor-labs.github.io/plant-humanities/images/phl-website-svg-logo.svg" />
        </div>

        <div id="brand" ref="brand">
          <span class="brand-name">Plant Humanities Lab</span> <br/>
          <p class="tagline" ref="tagline">Explore the cultural histories of plants and their influence on human societies </p>
        </div>

        <!-- hamburger menu -->
        <div id="menuToggle" ref="menuToggle">
          <input type="checkbox" />
          <span></span>
          <span></span>
          <span></span>
          <ul id="menu">
            <li @click="nav('/')">
              <i :class="`fas fa-home`"></i>Home
            </li>
            <template v-for="item in siteConfig.nav">
              <li :key="item.path" @click="nav(item.path)">
                <i :class="`fas fa-${item.icon}`"></i>{{item.label}}
              </li>
            </template>
            
            <li @click="openDocsSite" v-if="siteConfig.repo !== 've-docs'">
              <i :class="`fas fa-question`"></i>Documentation
            </li>
            <li @click="openSearchTool">
              <i :class="`fas fa-search`"></i> Search tool
            </li>
            
            <li @click="nav('/help')">
              <i :class="`fas fa-question`"></i>Help
            </li>
            <li @click="nav('/contributors')">
              <i class="fas fa-user-friends"></i>Contributors
            </li>
            
            <li @click="openContactModal">
              <i class="fas fa-envelope"></i>Contact Us
            </li>
            <!--
            <li>
              <a @click="logout" v-if="isAuthenticated">
                <i :class="`fas fa-user`"></i>Logout
              </a>
              <a :href="`https://visual-essays.app/login?redirect=${loginRedirect}`" v-else>
                <i :class="`fas fa-user`"></i>Author login
              </a>
            </li>
            <hr>
            -->
            <li @click="viewMarkdown" style="margin-top:10px;">
              <i class="fas fa-file-code"></i>View page markdown
            </li>
            <li @click="editMarkdown('default')" v-if="isAuthenticated">
              <i class="fas fa-edit"></i>Edit page
            </li>
            <!--
            <li v-if="isAuthenticated" @click="editMarkdown('custom')">
              <i class="fas fa-edit"></i>Edit page (Custom)
            </li>
            -->
            <li @click="gotoGithub" v-if="isAuthenticated">
              <i class="fab fa-github"></i>Github repository
            </li>
            <li style="margin-top:16px; padding:0;">
              <div class="app-version">App: {{version}}</div>
            </li>
            
            <li style="padding:0;">
              <div class="app-version">Content: {{contentRef}}</div>
            </li>
            
          </ul>
        </div>

      </div>
        
      <div class="search-container">
        <div class="search-header">
          <div class="search-header__title">Plant Search</div>
          <div class="search-header__subtitle">Select language, enter search term and begin your plant research</div>
        </div>
        <div class="search-components">

          <div class="language-selector">
            <select v-model="selectedLanguage" class="selector">
              <option v-for="lang in languages"
                      :key="lang.code" :value="lang.code"
                      v-html="lang.label" :title="lang.tooltip"
              ></option>
            </select>
          </div>    
       
          <form class="search-input">
            <div
              aria-labelledby="autocomplete-label"
              class="autocomplete__container"
              role="combobox"
            >
              <input
                @keyup="inputHandler"
                aria-controls="autocomplete-results"
                aria-expanded="false"
                autocomplete="off"
                class="autocomplete__input"
                id="autocomplete-input"
                role="textbox"
                v-model="searchFor"
                label="Enter a plant name"
              />
              <button
                :style="`visibility: ${wdResults.length > 0 ? 'visible' : 'hidden'};`"
                @click="toggleDropdown"
                aria-label="toggle dropdown"
                class="autocomplete__dropdown-arrow"
              >
                <svg fill-rule="evenodd" height="5" viewBox="0 0 10 5" width="10">
                  <title>Open drop down</title>
                  <path d="M10 0L5 5 0 0z"></path>
                </svg>
              </button>
              <ul
                class="autocomplete__results"
                id="autocomplete-results"
                role="listbox"
              >
                <li :key="item.id" @click="itemSelected(item)" v-for="item in wdResults">
                  <ul>
                    <li>
                      <span class="label" v-html="item.label"></span>
                      <span class="aliases" v-if="item.aliases">({{item.aliases.join(', ')}})</span>
                    </li>
                    <li class="description" v-html="item.description"></li>
                  </ul>
                </li>
                <li @click="doSearch" class="continue" v-if="searchContinue">More...</li>
              </ul>
            </div>
          </form>
    
        </div>
        <div class="search-examples">
          <span class="examples-label">Example searches:</span>
          <span class="examples-links">
            <a href="https://search.plant-humanities.org/?eid=Q171497" target="_blank">Sunflower</a> |
            <a href="https://search.plant-humanities.org/?eid=Q1043" target="_blank">Carl Linnaeus</a> |
            <a href="https://search.plant-humanities.org/?eid=Q1055" target="_blank">Hamburg, Germany</a>
          </span>
        </div>
      </div>
    </div>

    <!-- contact us form/modal -->
    <modal
      :draggable="true"
      class="modal"
      height="auto"
      name="contact-modal"
      id="contact-modal"
      hidden="true"
    >
      <div class="contact-us-container">
        <h1>Contact us</h1>
        <hr>
        <form class="form-wrapper" ref="feedback-form" v-on:submit.prevent="onSubmit">
          <input v-model="name" name="name" placeholder="Name" class="form-name" type="text" required> <br/>
          <input v-model="email" placeholder="Email" class="form-email" type="email" required> <br/>
          <input v-model="university" placeholder="University Affiliation (optional)" class="form-uni" type="text"> <br/>
          <select v-model="role" class="form-role">
            <option disabled value="">Please select one</option>
            <option value="Undergraduate Student">Undergraduate</option>
            <option value="Graduate Student">Graduate Student</option>
            <option value="Faculty">College/University Faculty</option>
            <option value="Scholar">Independent Scholar</option>
            <option value="Plant Enthusiast">Plant Enthusiast</option>
          </select> <br/>
          <textarea v-model="message" placeholder="Your message here" class="form-message" type="text" required></textarea>

          <button class="form-submit">Submit form</button>
        </form>
      </div>
    </modal>

  </div>


</template>

<script>
  const defaultBanner = 'https://picsum.photos/id/403/1000/400?blur=1'

  const languages = [
      {code: 'ar', label: 'العربية', tooltip: 'Arabic'},
      {code: 'de', label: 'Deutsch', tooltip: 'German'},
      {code: 'en', label: 'English', tooltip: 'English'},
      {code: 'es', label: 'español', tooltip: 'Spanish'},
      {code: 'fr', label: 'français', tooltip: 'French'},
      {code: 'he', label: 'עברית', tooltip: 'Hebrew'},
      {code: 'it', label: 'italiano', tooltip: 'Italian'},
      {code: 'ja', label: '日本語', tooltip: 'Japanese'},
      {code: 'ko', label: '한국어', tooltip: 'Korean'},
      {code: 'nl', label: 'Nederlands', tooltip: 'Dutch'},
      {code: 'pl', label: 'polski', tooltip: 'Polish'},
      {code: 'pt', label: 'português', tooltip: 'Portuguese'},
      {code: 'ru', label: 'русский', tooltip: 'Russian'},
      {code: 'zh', label: '中文', tooltip: 'Chinese'},
      {code: 'hi', label: 'हिन्दी', tooltip: 'Hindi'},
      {code: 'bn', label: 'বাংলা', tooltip: 'Bengali'},
      {code: 'id', label: 'Bahasa Indonesia', tooltip: 'Indonesian'}
  ]

  module.exports = {
    name: 've-header',
    props: {
      active: { type: Boolean, default: true },
      scrollTop: { type: Number, default: 0 },
      essayConfig: { type: Object, default: () => ({}) },
      siteConfig: { type: Object, default: () => ({}) },
      isJuncture: { type: Boolean, default: false },
      isAuthenticated: { type: Boolean, default: false },
      isAdmin: { type: Boolean, default: false },
      loginsEnabled: { type: Boolean, default: false },
      contentSource: { type: Object, default: () => ({}) },
      version: { type: String, default: '' },
      contentRef: { type: String },
      //height: Number,

    },    
    data: () => ({
      dependencies: [],
      headerWidth: null,
      headerHeight: null,
      observer: null,
      name: '',
      email: '',
      university: '',
      role: '',
      message: '',

      languages,
      selectedLanguage: 'en',
      searchFor: null,
      isSearching: false,
      page: 1,
      wdResults: [],
      searchContinue: 0,
      currentListItemFocused: -1,
      isDropDownOpen: false
    }),    
    computed: {
      containerStyle() { return { 
        height: this.active ? `${this.scrollTop < 400 ? 400 - this.scrollTop : 0}px` : '0',
        backgroundColor: 'white',
        backgroundImage: `url(${this.essayConfig.banner || this.siteConfig.banner || defaultBanner})`
      } },
      banner() { return this.essayConfigLoaded ? (this.essayConfig.banner || this.siteConfig.banner) : null },
      bannerHeight() { return this.essayConfig && this.essayConfig.bannerHeight || this.siteConfig.bannerHeight || 400 },
      title() { return `Plant Humanities: ${this.essayConfig.title || this.siteConfig.title}` },
      author() { return this.essayConfig.author || this.siteConfig.tagline },

      essayConfigLoaded() { return this.essayConfig !== null },
      numMaps() { return (this.essayConfigLoaded && this.essayConfig['num-maps']) },
      numImages() { return (this.essayConfigLoaded && this.essayConfig['num-images']) },
      numSpecimens() { return (this.essayConfigLoaded && this.essayConfig['num-specimens']) },
      numPrimarySources() { return (this.essayConfigLoaded && this.essayConfig['num-primary-sources']) },
      hasStats() { return this.numMaps || this.numImages || this.numSpecimens || this.numPrimarySources },
      loginRedirect() { return encodeURIComponent(this.href.split('/').length === 3
        ? `${this.href}/`
        : this.href.split('/').length > 4 && this.href.split('/').pop() === ''
          ? this.href.slice(0,this.href.length-1)
          : this.href)
      }

    },
    mounted() {
      this.loadDependencies(this.dependencies, 0, this.init)

      console.log(`${this.$options.name}.mounted: height=${this.height}`, this.siteConfig, this.essayConfig)
      console.log(`isAuthenticated=${this.isAuthenticated}`)

      this.input = document.getElementById('autocomplete-input')
      this.dropdownArrow = document.querySelector('.autocomplete__dropdown-arrow')
      this.resultsList = document.getElementById('autocomplete-results')
      this.comboBox = document.querySelector('.autocomplete__container')

      // set initial height
      this.$refs.header.style.height = `${this.height}px`
    
    },
    methods: {
      closeDrawer() { document.querySelector('#menuToggle input').checked = false },
      nav(item) {
        this.closeDrawer()
        this.$emit('menu-item-clicked', item)
      },
      authenticate(e) {
        console.log('header.authenticate')
        e.preventDefault()
        this.closeDrawer()
        this.$emit('authenticate')
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
      gotoGithub() {
        this.closeDrawer()
        this.$emit('goto-github')
      },
      openDocsSite() {
        this.closeDrawer()
        this.$emit('open-docs-site')
      },
      openInfoboxModal() {
        this.closeDrawer()
        this.$emit('open-infobox-modal')
      },
      openContactModal() {
        this.closeDrawer()
        this.$modal.show('contact-modal')
      },
      onSubmit() {
        let body = `${this.message}\n\r[Sent by: ${this.name}`
        if (this.role !== '') body += `, ${this.role}`
        if (this.university !== '') body = body += ` at ${this.university}`
        body += ']'
        this.$emit('send-email', {
          fromAddress: this.email,
          toAddress: ['planthumanities@doaks.org', 'labs@ithaka.org'],
          messageSubject: 'Plant Humanities Lab Contact us form',
          messageBodyText: body,
        })
      },
      inputHandler: _.throttle(function () {
        if (this.searchFor) {
            if (!this.isDropDownOpen) this.openDropdown()
            this.searchContinue = 0
            this.doSearch()
        } else {
            this.wdResults = []
            if (this.isDropDownOpen) this.closeDropdown()
        }
      }, 500),

      setResults(results) {
        if (Array.isArray(results) && results.length > 0) {
          this.resultsList.innerHTML = results
            .map((item, index) =>
                `<li class="autocomplete-item" id="autocomplete-item-${index}" role="listitem" tabindex="0">${item.label}</li>`
            ).join('')
          this.currentListItemFocused = -1
        }
      },

      openDropdown() {
        this.isDropDownOpen = true
        this.resultsList.classList.add('visible')
        this.dropdownArrow.classList.add('expanded')
        this.comboBox.setAttribute('aria-expanded', 'true')
      },
      closeDropdown() {
        this.isDropDownOpen = false;
        this.resultsList.classList.remove('visible')
        this.dropdownArrow.classList.remove('expanded')
        this.comboBox.setAttribute('aria-expanded', 'false')
        this.input.setAttribute('aria-activedescendant', '')
      },
      toggleDropdown(event) {
        event.preventDefault()
        if (!this.isDropDownOpen) {
            this.openDropdown()
        } else {
            this.closeDropdown()
        }
      },
      itemSelected(item) {
        // event.preventDefault()
        this.closeDropdown()
        this.searchFor = item.label
        console.log(`item-selected`, item)
        this.openSearchTool(item.id)
      },
      reset() {
        this.searchFor = ''
        this.wdResults = []
        this.searchContinue = 0
        this.closeDropdown()
        this.$emit('reset')
      },

      doSearch() {
        // console.log(`doSearch: searchFor="${this.searchFor}" searchContinue=${this.searchContinue} isSearching=${this.isSearching}`)
        if (!this.searchFor || this.isSearching) return
        this.isSearching = true
        let url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${this.searchFor}&uselang=${this.selectedLanguage}&language=${this.selectedLanguage}&format=json&origin=*&continue=${this.searchContinue}`
        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.searchContinue = res['search-continue']
                this.wdResults = this.searchContinue > 7 ? [...this.wdResults, ...res.search] : res.search
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => (this.isSearching = false))
      },
      openSearchTool(eid) {
        this.openWindow(`https://search.plant-humanities.org/?eid=${eid}${this.selectedLanguage !== 'en' ? '&language='+this.selectedLanguage : ''}`, `toolbar=yes,location=yes,menubar=yes,scrollbars=yes,status=yes,titlebar=yes,left=0,top=0,width=1001,height=1200`)
      },
      openWindow(url, options) {
        console.log('openWindow', url)
        if (this.externalWindow) { this.externalWindow.close() }
        if (options === undefined) options = 'toolbar=yes,location=yes,scrollbars=yes,status=yes,left=0,top=0,width=1000,height=1200'
        this.externalWindow = window.open(url, '_blank', options)
      }
    },
    watch: {}
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
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto 1fr;
    grid-template-areas: 
      "homepage-header"
      "search-container";
    font-family: Roboto, sans-serif;
    font-size: 1rem;
    /* min-height: 100px; */
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    position: relative;
    margin: 0;
    color: rgba(0, 0, 0, 0.99);
  }

  .homepage-header {
    grid-area: homepage-header;
    padding: 0 1rem;
    background-color: #444A1E;
    height: 100px !important;
    z-index: 100;
    display: grid;
    grid-template-columns: 80px auto 100px;
  }
  
  .search-container {
    grid-area: search-container;
    align-self: center;
    display: grid;
    grid-template-columns: 105px auto;
    grid-template-rows: auto auto auto;
    grid-template-areas: 
      ". search-header"
      ". search-components"
      ". search-examples";
    background-color: rgba(0, 0, 0, .3);
    padding: 16px 0;
  }

  .search-header {
    grid-area: search-header;
  }

  .search-header__title {
    font-family: 'Playfair Display', Serif !important;
    font-size: 2.2em;
  }

  .search-header__subtitle {
    font-size: 1.3em;
    font-weight: normal;
    padding-top: 4px;
  }

  .search-header__title,
  .search-header__subtitle,
  .examples-label,
  .examples-links,
  .examples-links a {
    font-family: Roboto, sans-serif;
    color: white !important;
  }


  .search-components {
    grid-area: search-components;
    display: flex;
    height: 50px;
    margin: 24px 0;
  }

  .search-examples {
    font-size: 1.3em;
    font-weight: normal;
  }

  .language-selector {
    height: 100%;
  }

  .search-examples {
    grid-area: search-examples;
    margin-bottom: 16px;
  }

  .examples-label {
    font-weight: bold;
    padding-right: 10px;
  }

  .examples-links a{
    border-bottom: 1px solid white;
  }

  .marker {
    margin: 0 12px;
    text-decoration: none !important;
  }

  .selector {
    height: 100%;
    border: none;
    background-color: #F8F8F8;
    padding: 4px;
    border-radius: 3px 0 0 3px ;
    border-right: 1px solid #9e9e9e;
    font-size: 1em;
  }

  .search-input {
    display: inline-block;
    height: 100%;
    width: 100%;
    justify-self: left;
  }

  .autocomplete__container {
    grid-area: autocomplete-container;
    position: relative;
    width: 100%;
    max-width: 500px;
    height: 100%;
  }

  .autocomplete__results.visible {
    visibility: visible;
  }

  .autocomplete__input {
    display: block;
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
    padding-left: 9px;
    border-radius: 0 3px 3px 0;
    font-size: 1.4rem;
    opacity: 1 !important;
    pointer-events: unset !important;
  }

  .autocomplete__input:focus {
    border-color: hsl(221, 61%, 40%);
  }

  .autocomplete__dropdown-arrow {
    position: absolute;
    right: 0;
    top: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    height: 100%;
    transition: transform 0.2s linear;
  }

  .autocomplete__dropdown-arrow.expanded {
    transform: rotate(-180deg);
  }

  .autocomplete__results {
    visibility: hidden;
    position: absolute;
    top: 100%;
    margin: 0;
    width: 100%;
    overflow-y: auto;
    border: 1px solid #999;
    padding: 0;
    max-height: 400px;
    background: white;
    z-index: 10;
  }

  .autocomplete__results li {
    list-style: none;
    padding: 0.3rem 0.3rem;
    cursor: pointer;
    color: black;
    line-height: 1em !important;
    font-size: 1em;
  }

  .autocomplete__results ul {
    list-style-type: none;
    padding-left: 0;
  }

  .autocomplete__results > li:hover {
    background: hsl(212, 10%, 60%);
  }

  .autocomplete__results > li:focus {
    background: hsl(212, 10%, 70%);
  }

  .label {
    font-weight: bold;
  }

  .aliases {
    font-style: italic;
  }

  .description {
    font-size: 1em;
  }

  .continue {
    font-weight: bold;
    background-color: #ddd;
  }

  #do-labs {
    background-color: black;
    font-size: .8rem;
    padding: 14px;
    color: white;
    text-align: center;
  }

  #logo {
    padding: 8px;
    grid-column-start: 1;
  }

  #logo img {
    vertical-align: unset;
  }

  #brand {
    grid-column-start: 2;
    margin-left: 0.5rem;
  }

  .brand-name {
    font-family: 'Playfair Display', Serif;
    font-size: 3rem;
    color: white;
    line-height: 1.3;
  }

  .tagline {
    font-size: 1.3rem;
    color: white;
    font-family: Roboto, Sans-serif;
    font-weight: 300;
    margin: 0;
    line-height: 1;
  }

  .app-version {
    font-size: 0.8rem;
    line-height: 1.5;
  }

  #menuToggle {
    grid-column-start: 3;
    display: block;
    position: absolute;
    top: 30px;
    right: 30px;
    margin-left: 30px;
    z-index: 1;
    -webkit-user-select: none;
    user-select: none;
  }

  #menuToggle a {
    text-decoration: none;
    color: #232323;
    transition: color 0.3s ease;
  }

  #menuToggle a:hover {
    color: tomato;
  }

  #menuToggle input {
    display: block;
    width: 40px;
    height: 32px;
    position: absolute;
    top: -7px;
    left: -5px;
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
    width: 30px;
    height: 4px;
    margin-bottom: 4px;
    position: relative;
    background: #ffffff;
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
  * at the top right of the screen
  */
  #menu {
    display: none;
    position: absolute;
    width: 200px;
    margin: -118px 0 0 -160px;
    padding: 120px 10px 10px 10px;
    background: #ededed;
    list-style-type: none;
    -webkit-font-smoothing: antialiased;
    /* to stop flickering of text in safari */
    transform-origin: 0% 0%;
    transform: translate(100%, 0);
    transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  #menu li {
    display: flex;
    /* padding: 0.5em 0; */
    font-size: 1em;
  }

  #menu li:hover {
    cursor: pointer;
    color: #1976d2;
  }

  #menu li svg {
    min-width: 1.5em;
    margin-right: 10px;
    margin-top: 6px;
    /* font-weight: bold; */
    font-size: 1em;
  }

  /*
  * And let's slide it in from the left
  */
  #menuToggle input:checked ~ ul {
    display: block;
    transform: none;
  }

  .contact-us-container {
    padding: 8px 16px 16px;
  }

  .form-wrapper {
    margin-top:16px;
  }

  .form-name, .form-email, .form-uni, .form-message {
    width: calc(100% - 24px);
    height: 40px;
    margin: 10px 0;
    padding: 8px;
  }

  .form-role {
    width: calc(100% - 4px);
    height: 60px;
    margin: 10px 0;
    padding: 6px;
  }

  .form-message {
    height: 160px;
  }

  .form-submit {
    height: 40px;
    border: 0;
    color: white;
    border-radius: 4px;
    background-color:green;
  }

  input:focus:invalid {
    border: 2px solid red;
  }

  input:required:valid {
    border: 2px solid green;
  }

  @media (max-width: 920px) {
    .homepage-header {
      grid-template-columns: 8vw auto 8vw;
      height: 9vw !important;
    }
    .search-container {
      display: block;
      padding: 0 7vw ;
    }
    .search-header__subtitle {
      padding-top: 0;
    }

    #contact-modal .vm--modal{
      width: 90vw;
    }

    #brand {
      margin-top: 6px;
    }

    .brand-name {
      font-size: 3.5vw;
      line-height: 5vw;
    }

    .tagline {
      font-size: 2vw;
      line-height: 2vw;
    }
  }

  @media (max-width: 740px) {
    #do-labs {
      padding: 2vw;
    }

    .homepage-header {
      padding: 1vw;
    }

    .search-components {
      height: 40px;
      margin: 16px 0;
    }

    .brand-name {
      font-size: 4vw;
      line-height: 5vw;
    }

    .tagline {
      font-size: 2.2vw;
      line-height: 3vw;
    }

    #logo {
      padding: 4px;
    }

    #brand {
      margin-top: 4px;
      margin-left: 8px;
      margin-right: 8px;
    }

    #menuToggle {
      top: 20px;
      right: 20px;
    }

    .search-container {
      padding: 0 5vw;
    }

    .search-header__title {
      font-size: 4.5vw;
    }

    .search-header__subtitle {
      font-size: 3.1vw;
    }

    .search-examples {
      padding: 8px 0;
      font-size: 3.1vw;
    }

  }

  @media (max-width: 600px) {
    .homepage-header {
      grid-template-columns: 8vw auto 8vw;
    }

    .search-components {
      width: 85vw;
    }

    .brand-name {
      font-size: 5vw;
      line-height: 5vw;
    }

    .tagline {
      font-size: 2.2vw;
    }

    #brand {
      margin-top: 2px;
      margin-left: 6px;
    }

    #menuToggle {
      top: 10px;
      right: 10px;
    }

  }
</style>

<style>
  /*not scoped*/
  @media (max-width: 920px) {

    #contact-modal .vm--modal {
      width: 90vw!important;
      left: 5vw!important;
    }
  }


</style>