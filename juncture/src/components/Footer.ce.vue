<template>

  <div ref="root" class="flex bg-slate-100 p-6 gap-8 mt-8 items-center w-full h-8 justify-between">
    
    <template v-for="li, idx in footerElems" :key="`li-${idx}`">

      <!--
        <sl-icon v-if="icons[li.innerHTML]" 
        :name="icons[li.innerHTML].icon" 
        :label="icons[li.innerHTML].label"
        @click="onClick(li, $event)"
        style="font-size:24px"
      ></sl-icon>
      -->

      <div
        :class="`flex items-center gap-4 whitespace-nowrap ${li.className}`" 
        :style="styleToObj(li.getAttribute('style') || '')" 
        v-html="li.innerHTML"
        @click="onClick(li, $event)"
      >
    </div>

    </template>

    <!--
    <sl-dialog label="Page Source" class="page-source-dialog" :style="{'--width': isMobile() ? '100vw' : '80vw'}">
      <ve-snippet v-if="sourcePath" :src="sourcePath" tabs="markdown,html,wordpress" disable-drag></ve-snippet>
      <sl-button slot="footer" variant="primary" @click="showPageSourceDialog = false">Close</sl-button>
    </sl-dialog>
    -->

  </div>

</template>
  
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'

  import { isMobile } from '../utils'

  const props = defineProps({
    sticky: { type: Boolean }
  })

  const icons:any = {
    'view-code': {icon: 'markdown', label: 'View Page Code'}
  }

  const footerElems = ref<HTMLUListElement[]>([])

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const shadowRoot = computed(() => root?.value?.parentNode)

  const showPageSourceDialog = ref(false)
  watch(showPageSourceDialog, () => pageSourceDialog.open = showPageSourceDialog.value )

  let pageSourceDialog: any

  const sourcePath = ref<string>()

  watch(host, () => {
    // pageSourceDialog = shadowRoot.value?.querySelector('.page-source-dialog')
    // pageSourceDialog.addEventListener('sl-hide', () => showPageSourceDialog.value = false)
  })

  watch(host, () => init())
  
  function init() {
    host.value.style.clear = 'both'
    if (props.sticky) setSticky()
    footerElems.value = Array.from(host.value?.querySelectorAll('li'))
  }

  function setSticky() {
    host.value.classList.add('sticky')
    let footerHeight = host.value.offsetHeight
    footerHeight += parseInt(window.getComputedStyle(host.value).getPropertyValue('margin-top'))
    footerHeight += parseInt(window.getComputedStyle(host.value).getPropertyValue('margin-bottom'))
    let mainEl = document.querySelector('main')
    if (mainEl) mainEl.style.paddingBottom = `${footerHeight}px`
    host.value.style.width = `${host.value.parentElement.clientWidth}px`
    document.body.style.marginBottom = '80px'
  }

  function styleToObj(s:string) {
    // Converts style value to object
    return s
      ? Object.fromEntries(s.split(';').filter(s => s.trim()).map(s => s.split(':').map(s => s.trim())))
      : {}
  }

  function showSource() {
    let prefix = (window as any).PREFIX
    let isGHP = location.hostname.indexOf('github.io') !== -1
    let path = location.pathname.split('/').filter(pe => pe).filter(pe => pe !== 'editor').slice(isGHP ? 1 : 0).join('/')
    sourcePath.value = prefix && path.indexOf(prefix) !== 0
      ? `${prefix}/${path}`
      : path
    // console.log('showSource', toRaw(sourcePath.value))
    showPageSourceDialog.value = true
  }

  function onClick(el:HTMLUListElement, evt:MouseEvent) {
    if (el.innerHTML === 'view-code') {
      evt.stopPropagation()
      showSource()
    }
  }

</script>

<style>
  @import '../tailwind.css';

/*
  * {box-sizing: border-box;}

  .main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 9px 12px;
    margin: auto;
    font-family: Roboto, sans-serif;
    font-size: .9rem;
    z-index: 100;
    background-color: #eee;
    color: #444;
    margin-top: 36px;
    border-radius: 3px;
  }

  a, sl-icon { color: #0645ad; text-decoration:none;}
  a:visited { color: #0b0080; }
  a:hover, sl-icon:hover { color: #06e; cursor: pointer; }
  a:active { color:#faa700; }
  a:focus { outline: thin dotted; }
  a:hover, a:active{ outline: 0; }

  .main.sticky {
    position: fixed;
    bottom: 0;
  }

  div {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .main div {
    cursor: pointer;
  }

  img {
    height: 36px;
    vertical-align: middle;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .logo, .logo img {
    height: 20px;
  }

  .push {
    margin-left: auto;
  }

 sl-dialog::part(panel) {
  color: #444;
  font-size: medium;
}
*/

img {
  height: 36px;
}
.push {
  margin-left: auto;
}
</style>