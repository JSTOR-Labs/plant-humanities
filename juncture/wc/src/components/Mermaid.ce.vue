<template>

  <div ref="root" id="main">
    <div class="content">
      <div id="diagram"></div>
    <div v-if="props.caption" id="caption-bar">
      <div class="label" v-html="caption"></div>
    </div>
    </div>
  </div>


</template>
  
<script setup lang="ts">

  import { computed, ref, toRaw, watch } from 'vue'
  // import '../mermaid.min.js'
  import mermaid from 'mermaid'

  // const mermaid = (window as any).mermaid

  const props = defineProps({
    type: { type: String },
    caption: { type: String },
    width: { type: String },
    height: { type: String },
    position: { type: String },
    right: { type: Boolean },
    left: { type: Boolean },
    full: { type: Boolean },
    sticky: { type: Boolean }
  })

  const root = ref<HTMLElement | null>(null)
  const shadowRoot = computed(() => root?.value?.parentNode)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const content = computed(() => shadowRoot.value?.querySelector('.content') as HTMLElement)
  
  watch(host, () => doLayout())

  const position:string = props.position || (props.right ? 'right' : props.left ? 'left' : 'full')

  function doLayout() {
    host.value.classList.add('ve-component')
    host.value.classList.add(position)
    if (position === 'full') {
      host.value.style.width = '100%'
    } else {
      host.value.style.float = position
      host.value.style.width = '50%'
    }
    host.value.style.width = window.getComputedStyle(host.value).width

    // if (props.sticky) makeSticky(host.value)
    
    content.value.style.width = props.width || '100%'
    let width = parseInt(window.getComputedStyle(content.value).width.slice(0,-2))
    content.value.style.width = `${width}px`
    // content.value.style.height = `${width}px`
    init()
  }

  function init() {
    let diagramText = host.value.textContent.trim()
    mermaid.initialize({ startOnLoad: false });
    (async function () {
      let element = shadowRoot.value?.querySelector('#diagram')
      const insertSvg = function (svgCode:any) {
        if (element) element.innerHTML = svgCode
      }
      await mermaid.render('diagram', diagramText, insertSvg)
      // const graph = await mermaid.render('graphDiv', diagramText.value, insertSvg)
      // console.log(graph)
    })()
  }

</script>

<style>

  * { box-sizing: border-box; }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }

  #diagram {
    display: block;
    margin: auto;
    width: 100%;
    padding: 12px 0;
  }

  #caption-bar  {
    display: flex;
    align-items: center;
    height: 32px;
    width: 100%;
    background-color: #555;
    color: white;
    padding: 0 12px;
  }

  .entityBox:hover {
    fill: yellow;
  }

</style>