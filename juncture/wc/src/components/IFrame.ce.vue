<template>

  <div ref="root" class="main">
    <div class="content">
      <iframe :src="src" :width="width" :height="height"></iframe>
    </div>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
  
  import { isMobile, makeSticky } from '../utils'

  const props = defineProps({
    allow: { type: String },
    allowfullscreen: { type: Boolean },
    allowpaymentrequest: { type: Boolean },
    height: { type: String },
    loading: { type: String }, // eager or lazy
    name: { type: String },
    referrerpolicy: { type: String }, // no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin-when-cross-origin, or unsafe-url 
    sandbox: { type: String }, // allow-forms, allow-pointer-lock, allow-popups, allow-same-origin, allow-scripts, or allow-top-navigation 
    src: { type: String }, // URL
    srcdoc: { type: String }, // HTML
    width: { type: String },

    // Positioning props
    position: { type: String },
    full: { type: Boolean },
    left: { type: Boolean  },
    right: { type: Boolean },
    sticky: { type: Boolean  }
  })

  const root = ref<HTMLElement | null>(null)
  const shadowRoot = computed(() => root?.value?.parentNode)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const content = computed(() => shadowRoot.value?.querySelector('.content') as HTMLElement)

  const src = ref<string>()
  const width = ref(0)
  const height = ref(0)

  const position:string = props.position || (isMobile() ? 'full' : (props.right ? 'right' : props.left ? 'left' : 'full'))

  onMounted(() => init())
  
  function init() {
    if (props.src) src.value = props.src
    doLayout()
  }

  function doLayout() {

    if (props.sticky) makeSticky(host.value)

    host.value.classList.add('ve-component')
    host.value.classList.add(position)
    if (position === 'full') {
      host.value.style.width = '100%'
    } else {
      host.value.style.float = position
      host.value.style.width = '50%'
    }
    nextTick(() => {
      host.value.style.width = window.getComputedStyle(host.value).width
      host.value.style.height = props.height || window.getComputedStyle(host.value).width

      // console.log(`host: width=${host.value.style.width} height=${host.value.style.height}`)

      content.value.style.width = props.width || window.getComputedStyle(host.value).width
      content.value.style.height = props.height || window.getComputedStyle(host.value).width
      nextTick(() => {
        width.value = parseInt(window.getComputedStyle(content.value).width.slice(0,-2))
        height.value = parseInt(window.getComputedStyle(content.value).height.slice(0,-2))
        // console.log(`content: width=${width.value} height=${height.value}`)
      })
    })
  }

</script>

<style>

  * { box-sizing: border-box; }

  .main {
    height: 500px;
  }

  :host {
    display: block;
    width: 100%;
    background-color: white;
  }

  .content {
    margin: auto;
    /* box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px; */
  }

  iframe {
    border: none;
  }
  
</style>