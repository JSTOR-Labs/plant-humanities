
<template>
  <div class="header" :style="containerStyle">

    <nav>
      <div id="menuToggle">
        <input type="checkbox" />
        <span></span>
        <span></span>
        <span></span>
        <ul id="menu">

          <li @click="doMenuAction('load-page', '/')"><i :class="`fas fa-home`"></i>Home</li>

          <!--  Adds menu items defined in site config.yaml -->
          <template v-for="item in siteConfig.nav">
            <li :key="item.path" @click="doMenuAction('load-page', item.path)"><i :class="`fas fa-${item.icon}`"></i>{{item.label}}</li>
          </template>

          <template v-if="isJuncture">
            <hr>

            <li v-if="loginsEnabled">
              <a v-if="isAuthenticated" @click="doMenuAction('logout')"><i :class="`fas fa-user`"></i>Logout</a>
              <a v-else @click="doMenuAction('authenticate')"><i :class="`fas fa-user`"></i>Login</a>
            </li>

            <template v-if="isAuthenticated">
              <li @click="doMenuAction('viewMarkdown')"><i class="fas fa-file-code"></i>View page markdown</li>
              <li v-if="((contentSource.acct !== 'jstor-labs' && contentSource.repo !== 'juncture')|| isAdmin)" @click="doMenuAction('editMarkdown')">
                <i class="fas fa-edit"></i>Edit this page
              </li>
              <li v-if="((contentSource.acct !== 'jstor-labs' && contentSource.repo !== 'juncture')|| isAdmin)" @click="doMenuAction('addPage')">
                <i class="fas fa-file-medical"></i>Add a page
              </li>
              <li @click="doMenuAction('gotoGitHub')"><i class="fab fa-github"></i>Goto to GitHub</li>
                          
              <hr>
              <li v-if="isAuthenticated" @click="doMenuAction('createSite')"><i class="fas fa-plus-circle"></i>Create new site</li>
              <li v-if="isAdmin" @click="doMenuAction('updateSite')"><i class="fas fa-wrench"></i>Software update</li>
            </template>

          </template>

          <li v-if="version"> <br><div class="version">Version: {{version}}</div></li>
        </ul>
      </div>
    </nav>

    <template v-if="isHomePage">
      <div class="header-wrapper">

        <div class="homepage-header">
          <div id="logo" ref="logo">
            <img :src="`${contentSource.assetsBaseUrl}/images/phl-website-png-logo.png`" xlink:href="/images/phl-website-svg-logo.svg" />
          </div>

          <div id="brand" ref="brand">
            <span class="brand-name">Plant Humanities Lab</span> <br/>
            <p class="tagline" ref="tagline">Explore the cultural histories of plants and their influence on human societies </p>
          </div>
        </div>

        <div class="search-container">
          <div class="search-header">
            <!--
            <div class="search-header__title">Plant Search</div>
            <div class="search-header__subtitle">Discover primary sources, databases, and scholarship</div>
            -->
            <div class="search-header__subtitle">Begin your plant research by discovering primary sources, databases, and scholarship</div>
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
              <a href="https://search.plant-humanities.org/?eid=Q5986917" target="_blank">Azalea</a> |
              <a href="https://search.plant-humanities.org/?eid=Q7218532" target="_blank">Toxicodendron radicans</a> |
              <a href="https://search.plant-humanities.org/?eid=Q394451" target="_blank">Agnes Arber</a>
            </span>
          </div>
        </div>

      </div>
    </template>

    <template v-else>

      <div class="title-bar">
        <div class="title" v-html="title"></div>
        <div class="author" v-html="author"></div>
        <div class="buttons">
          <button v-if="essayConfig && essayConfig && essayConfig.eid" @click="showForm('citation-export-form')" class="citation"><i class="fas fa-quote-left"></i>  Cite this essay</button>
          <button v-if="essayConfig && essayConfig" @click="openSearchTool(essayConfig.about)" class="search"><i class="fas fa-search"></i>  More resources</button>
        <div>
      </div>
  
    </template>

    <!-- Contact form -->
    <div id="contact-form" class="modal-form" style="display: none;">
      <form v-on:submit.prevent class="form-wrapper">
        <h1>Contact us</h1>
        <input v-model="contactName" name="name" placeholder="Name" class="form-name" type="text" required>
        <input v-model="contactEmail" placeholder="Email" class="form-email" type="email" required>
        <input v-model="university" placeholder="University Affiliation (optional)" class="form-uni" type="text">
          <select v-model="role" class="form-role">
            <option disabled value="">Please select one</option>
            <option value="Undergraduate Student">Undergraduate</option>
            <option value="Graduate Student">Graduate Student</option>
            <option value="Faculty">College/University Faculty</option>
            <option value="Scholar">Independent Scholar</option>
            <option value="Plant Enthusiast">Plant Enthusiast</option>
          </select>
        <textarea v-model="contactMessage" placeholder="Your message here" class="form-message" type="text" required></textarea>
        <div v-html="doActionResponse.message"></div>
        <div class="form-controls">
          <button v-if="!doActionResponse.status" class="form-cancel" formnovalidate @click="hideForm">Cancel</button>
          <button v-if="!doActionResponse.status" class="form-submit" @click="submitContactForm">Submit Form</button>
          <button v-if="doActionResponse.status === 'done'" class="form-submit" @click="hideForm">Close</button>
        </div>
      </form>
    </div>
    
    <!-- Citation export form -->
      <div id="citation-export-form" class="modal-form" style="display: none;">
      <div class="entity-infobox" id="cite-modal" title="Citation saved to clipboard">
        <div class="dialog-header">
          <button class="close-button" @click="hideForm('citation-modal')">
            <i class="fas fa-times"></i>
          </button>
          <h3 class="entity-title">Cite this essay</h3>
        </div>

        <div class="subtitle">MLA</div>
        <div class="citation-wrapper">
          <div class="citation-text" @click="copyTextToClipboard" v-html="mlaCitation"></div>
          <div class="copy-citation" @click="copyCitationToClipboard(`${mlaCitation}`, 1)" title="Copy to clipboard">Copy</div>
          <div class="tooltiptext1">Copied to Clipboard</div>
        </div>
        
        <div class="subtitle">APA</div>
        <div class="citation-wrapper">
          <div class="citation-text" @click="copyTextToClipboard" v-html="apaCitation"></div>
          <div class="copy-citation" @click="copyCitationToClipboard(`${apaCitation}`, 2)" title="Copy to clipboard">Copy</div>
          <div class="tooltiptext2">Copied to Clipboard</div>
          
        </div>

        <div class="subtitle">Chicago</div>
        <div class="citation-wrapper">
          <div class="citation-text" @click="copyTextToClipboard" v-html="chicagoCitation"></div>
          <div class="copy-citation" @click="copyCitationToClipboard(`${chicagoCitation}`, 3)" title="Copy to clipboard">Copy</div>
          <div class="tooltiptext3">Copied to Clipboard</div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  /* global _ */

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
  const defaultBanner = 'https://picsum.photos/id/403/1000/400?blur=1'

  module.exports = {
    name: 've-header',
    props: {
      active: { type: Boolean, default: true },
      path: { type: String, default: '/' },
      scrollTop: { type: Number, default: 0 },
      essayConfig: { type: Object, default: () => ({}) },
      siteConfig: { type: Object, default: () => ({}) },
      isJuncture: { type: Boolean, default: false },
      isAuthenticated: { type: Boolean, default: false },
      isAdmin: { type: Boolean, default: false },
      loginsEnabled: { type: Boolean, default: false },
      contentSource: { type: Object, default: () => ({}) },
      doActionCallback: { type: Object, default: () => ({}) },
      version: { type: String, default: '' },
    },    
    data: () => ({
      dependencies: [],
      languages,
      selectedLanguage: 'en',
      searchFor: null,
      isSearching: false,
      searchContinue: 0,
      wdResults: [],
      input: null,
      dropdownArrow: null,
      resultsList: null,
      comboBox: null,
      doActionResponse: {},
      externalWindow: null,

      // for contact-us email
      contactName: null,
      contactEmail: null,
      contactMessage: null,
      role: '',
      university: '', 

      // for citation export
      mlaCitation: null,
      apaCitation: null,
      chicagoCitation: null
    }),    
    computed: {
      isHomePage() { return this.path === '/' },
      containerStyle() { return { 
        height: this.active ? `${this.scrollTop < 400 ? 400 - this.scrollTop : 0}px` : '0',
        backgroundColor: 'white',
        backgroundImage: `url(${this.banner})`,
        minHeight: `${this.path === '/' ? 340 : 90}px`
      } },
      banner() { return this.essayConfig !== null ? (this.essayConfig.banner || this.siteConfig.banner) : null },
      title() { return this.essayConfig !== null ? this.essayConfig.title || this.siteConfig.title : null},
      author() { return this.essayConfig !== null ? this.essayConfig.author || this.siteConfig.tagline : null },
    },
    mounted() { this.loadDependencies(this.dependencies, 0, this.init) },
    methods: {
      init() {
        this.input = document.getElementById('autocomplete-input')
        this.dropdownArrow = document.querySelector('.autocomplete__dropdown-arrow')
        this.resultsList = document.getElementById('autocomplete-results')
        this.comboBox = document.querySelector('.autocomplete__container')
      },

      async getCitationData(eid) {
        let resp = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${eid}.json`)
        if (resp.ok) {
          resp = await resp.json()
          if (resp.entities && resp.entities[eid]) this.formatCitations(resp.entities[eid])
        }
      },

      async getEntityLabels(entity) {
        let labels = {}
        let eids = new Set()
        Object.values(entity.claims).forEach(claims => claims.forEach(claim => {
          if (claim.mainsnak.datavalue.type === 'wikibase-entityid') eids.add(claim.mainsnak.datavalue.value.id) 
        }))
        if (eids.size > 0) {
          let values = Array.from(eids).map(eid => `(<http://www.wikidata.org/entity/${eid}>)`).join(' ')
          let query = `SELECT ?item ?label WHERE { VALUES (?item) { ${values} } ?item rdfs:label ?label . FILTER(LANG(?label) = 'en')}`
          let resp = await fetch('https://query.wikidata.org/sparql', {
            method: 'POST', body: new URLSearchParams({query}),
            headers: { Accept: 'application/sparql-results+json', 'Content-type': 'application/x-www-form-urlencoded' }
          })
          resp = await resp.json()
          resp.results.bindings.forEach(rec => labels[rec.item.value.split('/').pop()] = rec.label.value)
        }
        return labels

      },
      
      async formatCitations(entity){
        // console.log(`formatCitation`, entity)
        let labels = await this.getEntityLabels(entity)
        let claims = entity.claims
      
        let authors = []
        if (claims['P50']) {
          authors = [
            ...authors, 
            ...claims['P50']
              .map(claim => claim.mainsnak.datavalue.value)
              .map(val => val['entity-type'] === 'item' ? labels[val.id] : val.value)
          ]
        }
        if (claims['P2093']) { // author name string
          authors = [
            ...authors, 
            ...claims['P2093'].map(claim => claim.mainsnak.datavalue.value)
          ]
        }
        let title = claims['P1476'] ? claims['P1476'][0].mainsnak.datavalue.value.text : ''

        let sponsors = claims['P859']
          ? claims['P859']
            .map(claim => claim.mainsnak.datavalue.value)
            .map(val => val['entity-type'] === 'item' ? labels[val.id] : val.value)
          : []
        let sponsor = sponsors.length > 0 ? sponsors[0] : ''

        let publishDate = '2021'
        let accessDate = new Date()
        let url = claims['P953'] ? claims['P953'][0].mainsnak.datavalue.value : ''

        // console.log(`title="${title}" authors=${authors} sponsor=${sponsor} url=${url} publishDate=${publishDate} accessDate=${accessDate}`)

        //format authors
        let mlaAuthor = ''
        let apaAuthor = ''
        let chicagoAuthor = ''

        if (authors.length > 0) {
          let splitAuthor = authors[0].split(' ');
          mlaAuthor = splitAuthor[splitAuthor.length-1] + ', ' + splitAuthor.slice(0, splitAuthor.length-1).join(' ')
          apaAuthor = splitAuthor[splitAuthor.length-1] + ', ' + splitAuthor[0].charAt(0)
          chicagoAuthor = splitAuthor[splitAuthor.length-1] + ', ' + splitAuthor.slice(0, splitAuthor.length-1).join(' ')

          if (authors.length > 1){
            for (var i = 1; i < authors.length; i++){

              if (i == authors.length-1){
                mlaAuthor += ', and ' + authors[i]
                apaAuthor += '., & ' + authors[i].split(' ').pop()+ ', ' + authors[i].split(' ')[0].charAt(0)
                chicagoAuthor += ', and ' + authors[i]
              }
              else {
                mlaAuthor += ', ' + authors[i]
                apaAuthor += '., ' + authors[i].split(' ').pop()+ ', ' + authors[i].split(' ')[0].charAt(0)
                chicagoAuthor += ', ' + authors[i]

              }
            }
          }
          
          mlaAuthor += '. '
          apaAuthor += '. '
          chicagoAuthor += '. '
        }

        //mla
        let mla = mlaAuthor + '<i>' + title + '</i>. ' + sponsors + ', ' + publishDate + '. '
        this.mla += url + '. Accessed ' + accessDate.getDate() + ' ' + accessDate.toLocaleString('default', { month: 'short' }) + '. ' + accessDate.getFullYear()+ '.' 
        this.mlaCitation = mla

        //apa
        this.apaCitation = apaAuthor + '('+ publishDate + '). ' + '<i>'+title+'</i>. ' + sponsor + '.'

        //chicago
        this.chicagoCitation = chicagoAuthor + '<i>'+title+'</i>. ' + sponsor + ', '
      },

      copyTextToClipboard(e) {
        if (navigator.clipboard) navigator.clipboard.writeText(e.target.textContent)
      },

      copyCitationToClipboard(citation, num) {
        //var copy = document.querySelectorAll('.copy-citation');
        if (navigator.clipboard){
          navigator.clipboard.writeText(citation)
          var styleClass = '.tooltiptext' + num
          var tooltip = document.querySelector(styleClass);
          tooltip.style.visibility = 'visible';
          setTimeout(function(){
            tooltip.style.visibility = 'hidden';
            }, 4000);
        }
      },

      doMenuAction(action, options) {
        document.querySelector('#menuToggle input').checked = false
        if (action === 'load-page' && options === '/contact-us') {
          this.showForm('contact-form')
        } else {
          this.$emit('do-action', action, options)
        }
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
        this.openSearchTool(item.id)
      },
      reset() {
        this.searchFor = ''
        this.wdResults = []
        this.searchContinue = 0
        this.closeDropdown()
        this.$emit('reset')
      },
      openSearchTool(eid) {
        this.openWindow(`https://search.plant-humanities.org/?eid=${eid}${this.selectedLanguage !== 'en' ? '&language='+this.selectedLanguage : ''}`, `toolbar=yes,location=yes,menubar=yes,scrollbars=yes,status=yes,titlebar=yes,left=0,top=0,width=1001,height=1200`)
      },
      openWindow(url, options) {
        if (this.externalWindow) { this.externalWindow.close() }
        if (options === undefined) options = 'toolbar=yes,location=yes,scrollbars=yes,status=yes,left=0,top=0,width=1000,height=1200'
        this.externalWindow = window.open(url, '_blank', options)
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

      showForm(formId) {
        document.getElementById('app').classList.add('dimmed')
        let form = document.getElementById(formId)
        form.style.display = 'unset'
        form.classList.add('visible-form')
      },

      hideForm() {
        document.getElementById('app').classList.remove('dimmed')
        let form = document.querySelector('.visible-form')
        form.style.display = 'none'
        form.classList.remove('visible-form')
        this.doActionResponse = {}
      },

      submitContactForm() {
        let body = `${this.contactMessage}\n\r[Sent by: ${this.contactName} <${this.contactEmail}>]`
        if (this.role !== '') body += `, ${this.role}`
        if (this.university !== '') body = body += ` at ${this.university}`

        this.$emit('do-action', 'send-email', {
          fromAddress: `${this.contactName} <${this.contactEmail}>`,
          toAddress: this.siteConfig.contactForm.toEmail,
          messageSubject: this.siteConfig.contactForm.subject,
          messageBodyText: body,
        })
      }

    },
    watch: {
      doActionCallback(resp) { this.doActionResponse = resp },
      essayConfig: {
        handler: function (essayConfig) {
          if (!this.isHomePage && essayConfig && essayConfig.eid) this.getCitationData(essayConfig.eid)
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>

  [v-cloak] { display: none; }

  nav {
    grid-area: nav;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: white;
    color: #444;
  }

  .header {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    position: relative;
  }

  .title-bar {
    display: grid;
    align-items: stretch;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: 
      "title buttons"
      "author buttons";
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
    font-size: min(2.5vw, 2.2em);
    margin-left: 24px;
    display: inline-block;
    white-space: nowrap;
    padding: 16px 0 0 50px;
  }

  .author {
    grid-area: author;
    font-size: min(3vw, 1.3em);
    margin-left: 24px;
    font-weight: normal;
    padding: 0 0 10px 50px;
    align-self: center;
  }
  .title-bar .buttons {
    grid-area: buttons;
    align-self: center;
    justify-self: center;
    display: grid;
    grid-template-rows: 1fr 1fr;
  }
  .title-bar .buttons button {
    width: 180px;
    margin-left: auto;
    margin-right: 1.3vw;
    font-size: 14px;
    color: white;
    background-color: #7A9413;
    border-radius: 4px;
    padding: 8px;
    font-weight: normal;
    cursor: pointer;
  }
  .title-bar .buttons button i {
    min-width: 28px;
    text-align: center;
  }
  .header-wrapper {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto 1fr;
    grid-template-areas: 
      "homepage-header"
      "search-container";
    font-family: Roboto, sans-serif;
    font-size: 1rem;
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
    grid-template-areas: "logo brand nav";
  }
  
  .search-container {
    grid-area: search-container;
    align-self: center;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;
    grid-template-areas: 
      ". search-header"
      ". search-components"
      ". search-examples";
    background-color: rgba(0, 0, 0, .3);
    padding: 16px 16px;
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

  .tooltiptext1, .tooltiptext2, .tooltiptext3 {
    visibility: hidden; 
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    float: right;
    z-index: 1;
    margin-left: 10px;
    right:12px
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
    grid-area: logo;
    padding: 8px;
  }

  #logo img {
    vertical-align: unset;
    width: 100%;
  }

  #brand {
    grid-area: brand;
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

  .version {
    font-size: 0.9rem;
  }

  .subtitle {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .citation-wrapper {
    margin-top: 16px;
    margin-bottom: 32px;
    line-height: 1.3;
    max-height: 380px;
    display: flex;
    font-size: 1.1rem;
    overflow:auto
  }

  .citation-text {
    float: left;
    padding: 10px;
    border: 1px solid #626262;
    cursor: pointer;
  }

  .citation {
    margin-left: auto;
    margin-right: 1.3vw;
    font-size: 14px;
    color: white;
    background-color: #7A9413;
    border-radius: 4px;
    padding: 8px 24px 4px;
    font-weight: normal;
  }
  .search {
    margin-left: auto;
    margin-right: 1.3vw;
    margin-top: 0.6vh;
    font-size: 14px;
    color: white;
    background-color: #7A9413;
    border-radius: 4px;
    padding: 8px 20px 4px;
    font-weight: normal;
    cursor: pointer;
    text-align: center;
  }

  .copy-citation {
    float: right;
    color: white;
    background-color: #444A1E;
    border-radius: 4px;
    padding: 12px;
    height: 20px;
    margin-left: 10px;
    cursor: pointer;
  }

  .copy-citation:hover {
    background-color: #737e31;
  }

  .entity-infobox {
    color: black;
    align-items: left;
    margin: 1.5rem;
  }

  .dialog-header {
    margin-bottom: 2rem;
  }

  .close-button {
    float: right;
  }

  .entity-title {
    display: inline !important;
    margin: unset;
    font-size: 1.5em;
    font-weight: normal;
    font-family: 'Playfair Display', Serif;
  }

  .entity-infobox .v-card__text {
    height: 100%;
    min-height: 165px;
    padding-bottom: 0 !important;
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

  #menuToggle {
    grid-column-start: 3;
    display: block;
    position: absolute;
    top: 30px;
    right: 30px;
    margin-left: 30px;
    z-index: 110;
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
    padding: 0.5em 0;
    font-size: 1.1em;
  }

  #menu li i {
    width: 20px;
    margin-right: 10px;
    text-align: center;
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

  .modal-form {
    padding: 8px 16px 16px;
  }

  .visible-form {
    padding: 8px 16px 16px;
    height: auto;
  }

  .form-wrapper {
    margin-top:16px;
  }

  .form-name, .form-email, .form-uni, .form-message{
    width: calc(100% - 24px);
    height: 40px;
    margin: 10px 0;
    padding: 8px;
    font-size: 1rem;
  }

  .form-role {
    width: calc(100% - 4px);
    height: 60px;
    margin: 10px 0;
    padding: 6px;
    font-size: 1rem;
  }

  .form-message {
    height: 160px;
    font-size: 1rem;
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

.tagged.location,
p.active-elem .inferred.location,
.tagged.building,
p.active-elem .inferred.building,
.tagged.place,
p.active-elem .inferred.place,
.tagged.person,
p.active-elem .inferred.person,
.tagged.fictional_character,
p.active-elem .inferred.fictional_character,
.tagged.written_work,
p.active-elem .inferred.written_work,
.tagged.plant,
p.active-elem .inferred.plant,
.tagged.entity,
p.active-elem .inferred.entity,
.tagged.event,
p.active-elem .inferred.event {
  border-bottom: 2px solid #444A1E;
  cursor: pointer;
  z-index: 10;
  /* white-space: nowrap; */
}
.entity-highlight,
.tagged.location:hover,
p.active-elem .inferred.location:hover,
.tagged.building:hover,
p.active-elem .inferred.building:hover,
.tagged.place:hover,
p.active-elem .inferred.place:hover,
.tagged.person:hover,
p.active-elem .inferred.person:hover,
.tagged.fictional_character:hover,
p.active-elem .inferred.fictional_character:hover,
.tagged.written_work:hover,
p.active-elem .inferred.written_work:hover,
.tagged.plant:hover,
p.active-elem .inferred.plant:hover,
.tagged.entity:hover,
p.active-elem .inferred.entity:hover,
.tagged.event:hover,
p.active-elem .inferred.event:hover {
  background: #e1ecbe !important;
  transition: all 0.2s ease-in;
}

</style>
