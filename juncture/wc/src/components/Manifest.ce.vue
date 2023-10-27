<template>

  <div ref="root" class="manifest">
    
    <div class="main">
      <img class="thumbnail" :src="parsed?.thumbnail"/>
      <div class="label" v-html="parsed?.label"></div>
      <div v-if="parsed?.summary" class="summary" v-html="parsed?.summary"></div>
      <a v-if="parsed?.rights" :href="parsed?.rights" v-html="licenseBadge"/>
      <div class="links">
        <img src="https://juncture-digital.github.io/web-app/static/iiif.png" class="iiif" alt="IIIF manifest icon"
          @click="copyTextToClipboard(manifest.id)" 
        />
      </div>

    </div>
    
    <div class="detail">

      <div v-if="parsed?.provider" class="provider">
        <span class="label">provider</span>
        <div v-if="parsed.provider.length === 1" style="display:flex; align-items:center;">
          <img v-if="parsed.provider[0].logo" class="logo" :src="parsed.provider[0].logo.src"/>
          <a class="value" :href="parsed.provider[0].href" v-html="parsed.provider[0].label"/>
        </div>
        <ul v-else>
          <li v-for="provider, idx in parsed.provider" :key="`provider-${idx}`">
            <img v-if="provider.logo" class="logo" :src="provider.logo.src"/>
            <a class="value" :href="provider.href" v-html="provider.label"></a>
          </li>
        </ul>
      </div>

      <div v-if="parsed?.requiredStatement" class="requiredStatement">
        <span class="value" v-html="parsed.requiredStatement.value"></span>
      </div>
  
      <div v-if="parsed?.rights" class="rights">
        <span class="label">Reuse rights</span>
        <a class="value" :href="parsed.rights" v-html="parsed.rights"></a>
      </div>

      
      <div v-if="parsed?.metadata" class="metadata">
        <span class="label">metadata</span>
        <ul>
          <li v-for="item, idx in parsed.metadata" :key="`md-${idx}`">
            <span class="label" v-html="item.label"></span>
            <span v-if="item.value.length === 1" class="value" v-html="item.value[0]"></span>
            <ul v-else>
              <li v-for="value in item.value" class="value" v-html="value"></li>
            </ul>
          </li>
        </ul>
      </div>
      
      
      <div v-if="parsed?.navDate" class="navDate">
        <span class="label">navDate</span>
        <span class="value" v-html="parsed.navDate"></span>
      </div>

      <div v-if="parsed?.homepage" class="homepage">
        <span class="label">homepage</span>
        <a class="value" :href="parsed.homepage.href" v-html="parsed.homepage.label"></a>
      </div>

      <div v-if="parsed?.seeAlso" class="seeAlso">
        <span class="label">seeAlso</span>
        <a class="value" :href="parsed.seeAlso[0].href" v-html="parsed.seeAlso[0].label"></a>
      </div>

      <div v-if="parsed?.logo" class="logo">
        <span class="label">logo</span>
        <a class="value" :href="parsed.logo[0].src" v-html="parsed.logo[0].src"></a>
      </div>

      <!--
      <div v-if="parsed?.requiredStatement" class="requiredStatement">
        <span class="label">requiredStatement</span>
        <ul><li>
          <span class="label" v-html="parsed.requiredStatement.label"></span>
          <span class="value" v-html="parsed.requiredStatement.value"></span>
        </li></ul>
      </div>
      -->

      <div v-if="parsed?.imageData" class="imageData">
        <div>
          <span class="label">source</span>
          <a class="value" :href="parsed.imageData.id" :innerHTML="parsed.imageData.id.split('/').pop()"></a>
        </div>
        <div>
          <span class="label">format</span>
          <span class="value" :innerHTML="parsed.imageData.format"></span>
        </div>
        <div>
          <span class="label">width</span>
          <span class="value" :innerHTML="parsed.imageData.width"></span>
        </div>
        <div>
          <span class="label">height</span>
          <span class="value" :innerHTML="parsed.imageData.height"></span>
        </div>
      </div>

      <!--
      <div v-if="parsed?.thumbnail">
        <span class="label">thumbnail</span>
        <a class="value" :href="parsed.thumbnail" v-html="parsed.thumbnail"></a>
      </div>

      <div v-if="parsed?.service" class="service">
        <span class="label">service</span>
        <a class="value" :href="parsed.service" v-html="parsed.service"></a>
      </div>
      -->

    </div>

  </div>
  
</template>
  
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import { getItemInfo, getManifest } from '../utils'

  const props = defineProps({
    manifest: { type: String }
  })

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const manifest = ref<any>(null)
  const parsed = ref<any>(null)

  watch(manifest, () => parsed.value = parseManifest(manifest.value))
    
  const licenseBadge = computed(() => parsed.value && _getLicenseBadge(parsed.value))

  // watch(host, () => init())

  onMounted(() => init())

  function init() {
    if (typeof props.manifest === 'object') {
      manifest.value = props.manifest
    } else {
      getManifest(<string>props.manifest).then(resp => manifest.value = resp )
    }
  }

  function _value(langObj: any, language='en') {
    return typeof langObj === 'object' && !Array.isArray(langObj)
      ? langObj[language] || langObj.none || langObj[Object.keys(langObj).sort()[0]]
      : langObj
  }

  function parseManifest(_manifest:any) {
    let parsed: any = {}

    parsed.id = _value(_manifest.id)
    parsed.label = _value(_manifest.label)

    if (_manifest.summary) parsed.summary = _value(_manifest.summary)
    if (_manifest.rights) parsed.rights = _manifest.rights
    if (_manifest.thumbnail) parsed.thumbnail = _manifest.thumbnail[0].id || _manifest.thumbnail
    
    if (_manifest.metadata) {
      parsed.metadata = _manifest.metadata.map((item:any) => ({label: _value(item.label)[0], value: _value(item.value)}))
      let sourceUrl = parsed.metadata.find((item:any) => item.label == 'source_url')
      parsed.sourceUrl = sourceUrl ? sourceUrl.value[0] : null

      let depicts = parsed.metadata.find((md:any) => md.label === 'depicts')
      if (depicts) parsed.depicts = depicts.value
    }

    if (_manifest.provider) {
      parsed.provider = _manifest.provider.map((provider:any) => {
        let entry: any = {label: _value(provider.label), href:provider.id}
        if (provider.logo) entry.logo = {src:provider.logo[0].id}
        return entry
      })
    }

    if (_manifest.logo) {
      parsed.logo = _manifest.logo.map((item:any) => {
        let logoObj: any = { src: typeof item === 'object' ? item.id || item['@id'] : item }
        if (typeof item === 'object') {
          if (item.width) logoObj.width = item.width
          if (item.height) logoObj.height = item.height
        }
        return logoObj
      })
    }

    parsed.imageData = getItemInfo(_manifest)
    parsed.service = parsed.imageData.service && `${(parsed.imageData.service[0].id || parsed.imageData.service[0]['@id'])
      .replace(/\/info\.json$/,'')}/info.json`
      if (_manifest.requiredStatement) {
      let rs = _manifest.requiredStatement
      parsed.requiredStatement = {label: _value(rs.label), value: _value(rs.value)}
    }

    if (_manifest.homepage) {
      parsed.homepage = {label: _manifest.homepage.label ? _value(_manifest.homepage.label) : _manifest.homepage.id, href: _manifest.homepage.id}
    }

    if (_manifest.seeAlso) {
      parsed.seeAlso = _manifest.seeAlso.map((seeAlso:any) => ({label: seeAlso.label ? _value(seeAlso.label) : seeAlso.id, href: seeAlso.id}))
    }
    
    return parsed
  }


  function onIiifDrag(dragEvent: DragEvent) {
    console.log('onIiifDrag')
    dragEvent.dataTransfer?.setData('text/uri-list', `${manifest.value.id}?manifest=${manifest.value.id}`)
  }

  function copyTextToClipboard(text: string) {
      // console.log('copyTextToClipboard', text)
      if (navigator.clipboard) navigator.clipboard.writeText(text)
  }

  function _getLicenseBadge(_parsed:any):string {
    let config = {
      cc: {
        badgeWidth: 88,
        badgeHeight: 31,
        badgeTemplate: 'https://licensebuttons.net/l/${this.rightsCode}${this.rightsCode === "publicdomain" ? "" : "/"+this.version}/${this.badgeWidth}x${this.badgeHeight}.png'
      },
      rs: {
        badgeTemplate: 'https://rightsstatements.org/files/buttons/${this.rightsCode}.white.svg',
        backgroundColor: '318ac7'
      }
    }
    const fillTemplate = function(templateString:string, templateVars:object) {
      return new Function("return `"+templateString +"`;").call(templateVars);
    }
    let rights = _parsed.rights || ''
    let badgeHtml: string = ''
    let [rightsType, _, rightsCode, version] = rights.split('/').slice(2)
    if (rightsType === 'creativecommons.org') {
      rightsCode = rightsCode === 'zero' ? 'publicdomain' : rightsCode
      badgeHtml = `<img src="${fillTemplate(config.cc.badgeTemplate, {...config.cc, ...{rightsCode, version}})}"/>` 
    } else if (rightsType === 'rightsstatements.org') {
      badgeHtml = `<div style="display:inline-block;height:25px;padding:3px;background-color:#${config.rs.backgroundColor};"><img style="height:100%;" src="${fillTemplate(config.rs.badgeTemplate, {...config.rs, ...{rightsCode}})}"/></div>`
    }
    return badgeHtml
  }

</script>

<style scoped>

  * { box-sizing: border-box; }

  .manifest {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    background-color: white;
  }

  .main, .detail {
    display: flow-root;
    margin: 6px;
  }

  .main > * {
    margin-bottom: 6px;
  }

  .detail > div {
    margin-top: 12px;
  }

  .main .label {
    font-size: 1.2em;
    font-weight: bold;
  }

  .thumbnail {
    float: left;
    max-width: 45%;
    max-height: 200px;
    margin: 0 6px 6px 0;
    /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
  }

  .links {
    margin-top: 6px;
  }

  img.iiif {
    height: 24px;
    cursor: copy;
  }

  ul {
    list-style: none;
    padding-left: 12px;
    margin-top: 0;
  }

  .detail .label {
    font-size: 1.1em;
    font-weight: bold;
    min-width: 80px;
    margin-right: 6px;
  }

  .detail .label::after {
      content: ":";
  }

  .detail .value, .main .label {
    white-space: pre-wrap;
    /* These are technically the same, but use both */
    overflow-wrap: break-word;
    word-wrap: break-word;

    -ms-word-break: break-all;
    /* This is the dangerous one in WebKit, as it breaks things wherever */
    word-break: break-all;
    /* Instead use this non-standard one: */
    word-break: break-word;

    /* Adds a hyphen where the word breaks, if supported (No Blink) */
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
  }

  .logo {
    padding-right: 6px;
  }

  img.logo {
    height: 40px;
  }

  .manifest-id,
  .manifest-label,
  .summary,
  .provider,
  .rights,
  .service,
  .imageData div,
  .thumbnail {
    display: flex;
    align-items: flex-start;
  }
  .metadata > ul,
  .requiredStatement ul {
    padding-left: 24px;;
  }
  .metadata ul li,
  .requiredStatement ul li {
    display: flex;
  }
  .metadata ul ul {
    padding-left: 0;
  }

  /* a:visited { color: #551A8B; } */
  a:link,
  a:visited {
    color: #0000EE;
  }

</style>
