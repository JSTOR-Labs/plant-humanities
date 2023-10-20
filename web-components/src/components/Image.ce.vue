<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
  import OpenSeadragon, { TiledImage } from 'openseadragon'

  type ImageSize = {
    width: number,
    height: number
  }

  const root = ref<HTMLElement | null>(null)
  const osdEl = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const shadowRoot = computed(() => root?.value?.parentNode as HTMLElement)

  const osdWidth = ref<number>()
  watch(osdWidth, () => { resize() })

  const imageSize = ref<ImageSize>()
  const aspectRatio = computed(() =>  Number(((imageSize.value?.width || 1)/(imageSize.value?.height || 1)).toFixed(4)) )
  watch(aspectRatio, () => { 
    resize()
    if (osdEl.value) initOpenSeadragon()
  })

  // TODO: debounce size updates
  watch(osdEl, () => {
    if (!osdEl.value) return
    if (props.width) {
      root.value?.setAttribute('style', `width: ${props.width}px;margin: auto`)
      osdWidth.value = props.width
    } else {
      new ResizeObserver(() => { osdWidth.value = osdEl.value?.clientWidth } ).observe(osdEl.value)
    }
    if (imageSize.value) initOpenSeadragon()
  })

  const props = defineProps({
    src: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    left: { type: Boolean, default: false },
    right: { type: Boolean, default: false },
    cover: { type: Boolean, default: false },
    fit: { type: String, default: 'contain' },
    caption: { type: String },
    noCaption: { type: Boolean, default: false }
  })
  watch(props, () => { evalProps() })
  
  // OpenSeadragon - https://openseadragon.github.io/docs/
  const osd = ref<OpenSeadragon.Viewer>()

  // OpenSeadragon tile source - https://openseadragon.github.io/docs/OpenSeadragon.TileSource.html
  const tileSource:any = ref<TiledImage>()

  // Image source, can be an image or IIIF manifest URL
  const src = ref()
  watch(src, () => { getTileSource(src.value) })
  function setSrc(_src: string) {
    if (/upload\.wikimedia\.org/.test(_src)) {
      let parts = _src.split('/')
      let file = parts[5] === 'thumb' ? parts[8] : parts[7]
      src.value = `https://iiif.juncture-digital.org/wc:${file.replace(/ /g, '_')}/manifest.json` 
    } else {
      src.value = /^http/.test(_src) 
        ? _src
        : /^\w+:/.test(_src)
          ? `https://iiif.juncture-digital.org/${_src.replace(/ /g, '_')}/manifest.json` 
          : _src
    }
  }

  const manifest = ref()
  const caption = computed(() => props.caption || (manifest.value && manifest.value?.label?.en?.[0]))
  // watch(manifest, () => { console.log('manifest', toRaw(manifest.value)) })

  const coords = ref<string>()

  function evalProps() {
    setSrc(props.src)
  }

  onMounted(() => {
    evalProps()
    addInteractionHandlers()
  })

  // detect if src is a IIIF manifest
  async function isIIIFfManifest(src: string) {
    if (src.indexOf('manifest.json') > 0) return true
    let resp = await fetch(src, {method: 'HEAD'})
    return resp.headers.get('Content-Type')?.indexOf('image') === -1
  }

  // convert IIIF v2 manifest to v3; all operations in this component are based on v3
  async function prezi2to3(manifest: any) {
    let resp = await fetch('https://iiif.juncture-digital.org/prezi2to3/', {
      method: 'POST', 
      body: JSON.stringify(manifest)
    })
    if (resp.ok) return (await resp).json()
  }

  async function getTileSource(src:string) {
    if (await isIIIFfManifest(src)) {
      let manifest = await getManifest(src)
      let itemInfo = findItem({type:'Annotation', motivation:'painting'}, manifest).body
      imageSize.value = { width: itemInfo.width, height: itemInfo.height}
      tileSource.value = itemInfo.service
        ? `${(itemInfo.service[0].id || itemInfo.service[0]['@id'])}/info.json`
        : { url: itemInfo.id, type: 'image', buildPyramid: true }
    } else {
      getImageSize(src).then((size) => { imageSize.value = size })
      tileSource.value = { url: src, type: 'image', buildPyramid: true }
    }
  }

  // find an item in a IIIF manifest
  function findItem(toMatch: object, current: object, seq: number = 1): any {
    const found = _findItems(toMatch, current)
    return found.length >= seq ? found[seq-1] : null
  }

  // recursive helper for finding items in a IIIF manifest
  function _findItems(toMatch: object, current: any, found: object[] = []) {
    found = found || []
    if (current.items) {
      for (let i = 0; i < current.items.length; i++ ) {
        let item = current.items[i]
        let isMatch = !Object.entries(toMatch).find(([attr, val]) => item[attr] && item[attr] !== val)
        if (isMatch) found.push(item)
        else _findItems(toMatch, item, found)
      }
    }
    return found
  }

  // get a IIIF manifest, convert to v3 if necessary
  async function getManifest(src:any) {
    let resp = await fetch(src)
    if (resp.ok) {
      let _manifest:any = await resp.json()
      manifest.value = parseFloat(_manifest['@context'].split('/').slice(-2,-1).pop()) < 3
        ? await prezi2to3(manifest)
        : _manifest
      return manifest.value
    }
  }

  // get image size
  async function getImageSize(src: string): Promise<ImageSize> {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve({ width:img.width, height:img.height })
      img.onerror = () => reject()
      img.src = src
    })
  }

  function setOsdHeight() {
    if (osdEl.value?.clientWidth) {
      let osdHeight = props.height || Number(osdEl.value?.clientWidth / aspectRatio.value).toFixed(0)
      // console.log(`setOsdHeight() width:=${osdWidth.value} height=${osdHeight}`)
      osdEl.value?.setAttribute('style', `height: ${osdHeight}px;`)
    }
  }

  // resize OSD viewer
  function resize() {
    setOsdHeight
    setTimeout(() => osd.value?.viewport?.goHome(true), 100)
  }

  function initOpenSeadragon() {
    if (!osdEl.value) return
    let container = shadowRoot.value.querySelector('#osd') as HTMLElement
    // console.log(`initOpenSeadragon() width: ${osdEl.value?.clientWidth} imageHeight: ${imageSize.value?.height} osdHeight: ${osdEl.value?.clientHeight} tileSource: ${tileSource.value}`)
    setOsdHeight()
    const osdOptions: OpenSeadragon.Options = {
      element: container,
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      tileSources: tileSource.value,
      homeFillsViewer: props.cover || props.fit === 'cover',
      // showNavigationControl: true,
      // minZoomImageRatio: 1,
      maxZoomPixelRatio: 10,
      // showRotationControl: true,
      // showHomeControl: true,
      // showZoomControl: true,
      // showFullPageControl: true,
      // showNavigator: false,
      // sequenceMode: true,
      // showReferenceStrip: true,
      
      // animationTime: 0.5,
      // springStiffness: 10,
      
      // visibilityRatio: 1.0,
      // constrainDuringPan: true
      
    }
    osd.value = OpenSeadragon(osdOptions)
    osd.value.addHandler('viewport-change', () => watchCoords())
    setTimeout(() => setViewportCoords(), 500)
  }

  function addInteractionHandlers() {
    let el = host.value.parentElement
    while (el.parentElement && el.tagName !== 'MAIN') el = el.parentElement;
    (Array.from(el.querySelectorAll('a')) as HTMLAnchorElement[]).forEach(anchorElem => {
      let link = new URL(anchorElem.href)
      let qargs = new URLSearchParams(link.search)
      let region = qargs.get('zoom')
      if (region) {
        anchorElem.classList.add('zoom')
        anchorElem.href = 'javascript:void(0)'
        let imageEl = findImageEl(anchorElem)
        if (imageEl) {
          anchorElem.addEventListener('click', () => { if (region) zoomto(region) })
        }
      }
    })
  }

  function findImageEl(el:any) {

    function checkSibs(el:any) {
      let sib = el.previousSibling
      while (sib) {
        if (sib.nodeName === 'EZ-IMAGE') return sib === host.value ? sib : null
        sib = sib.previousSibling
      }
    }
  
    checkSibs(el)
    while (el.parentElement && el.tagName !== 'BODY') {
      el = el.parentElement
      let imageEl = el.querySelector(':scope > ez-image, :scope > p > ez-image')
      if (imageEl) return imageEl === host.value ? imageEl : null
    }
  }

  let zoomedToRegion:string = ''
  function zoomto(arg: string) {
    arg = arg.replace(/^zoomto\|/i,'')
    const match = arg?.match(/^(?<region>(pct:|pixel:|px:)?[\d.]+,[\d.]+,[\d.]+,[\d.]+)?$/)
    if (match) {
      let region = match?.groups?.region
      // console.log(`ez-image.zoomto: region=${region}`)
      if (region) {
        if (zoomedToRegion === region) {
          osd.value?.viewport.goHome()
          zoomedToRegion = ''
        } else {
          zoomedToRegion = region
          osd.value?.viewport.fitBounds(parseRegionString(region, osd.value), false)
        }
      }
    }
  }

  function parseRegionString(region: string, viewer: OpenSeadragon.Viewer) {
  let viewportRect
  const s1 = region.split(':')
  let [x,y,w,h] = s1[s1.length-1].split(',').map(v => parseInt(v))
  const size = viewer.world.getItemAt(0).getContentSize()
  if (s1.length === 2 && (s1[0] === 'pct' || s1[0] === 'percent')) {
    x = Math.round(size.x * x/100),
    y = Math.round(size.y * y/100),
    w = Math.round(size.x * w/100), 
    h = Math.round(size.y * h/100)
  }
  // viewportRect = viewer.viewport.imageToViewportRectangle(rect)
  viewportRect = viewer.viewport.imageToViewportRectangle(x,y,w,h)
  return viewportRect
}

function setViewportCoords() {
  const tiledImage = osd.value?.world.getItemAt(0)
  if (tiledImage) {
    let bounds = osd.value?.viewport.getBounds()
    const imageBounds = bounds ? tiledImage.viewportToImageRectangle(bounds) : null
    coords.value = imageBounds
      ? `${Math.ceil(imageBounds.x)},${Math.ceil(imageBounds.y)},${Math.ceil(imageBounds.width)},${Math.ceil(imageBounds.height)}`
      : ''
  }
}

let coordsDebounce: any = null
  function watchCoords() {
    if (coordsDebounce !== null) {
      clearTimeout(coordsDebounce)
      coordsDebounce = null
    }
    coordsDebounce = window.setTimeout(() => setViewportCoords(), 100)
  }

function copyTextToClipboard(text: string) {
  if (navigator.clipboard) navigator.clipboard.writeText(text)
}

</script>

<template>

<div ref="root" 
  class="rounded overflow-hidden shadow-lg"
  :class="{ 
    'float-left mr-4': left ,
    'float-right ml-4': right,
    'w-1/2': left || right,
    'w-full': !left && !right,
  }"
>
  <!-- <img class="w-full" :src="src" alt="Image title"> -->
  <div v-if="tileSource" ref="osdEl" id="osd" class="w-full" role="img" :aria-label="caption" :alt="caption"></div>
  <div v-if="tileSource && caption && !noCaption" class="group relative h-10 p-2">
    <div class="font-bold text-xl mb-2" v-html="caption"></div>
    <div v-if="coords"
      class="invisible group-hover:visible 
            absolute pr-4 pl-4 pt-2 pb-2 mt-24 
            bottom-0 right-0 cursor-copy
            ml-4 bg-slate-100 text-black"
      v-html="coords" 
      @click="copyTextToClipboard(coords || '')">
    </div>
  </div>
</div>

</template>

<style>
  @import '../tailwind.css';
</style>
