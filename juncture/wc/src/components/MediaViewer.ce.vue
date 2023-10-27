<template>
  <div ref="root" v-bind="$attrs"></div>

  <div id="outer" :class="annotationsEditable ? 'edit' : 'view'" :draggable="type === 'image'" @dragstart="onDrag(manifest, $event)">
    <div id="inner" :class="type">
      <div id="content">
        
        <!-- Single image -->
        <div v-if="type === 'image'" class="image-wrapper media-item">
          <ve-gif v-if="isGif(manifests[0])" :src="itemInfo.id" alt="Animated GIF" initially-paused restart-on-play></ve-gif>
          <img v-else-if="static" :src="staticImage(manifest, options, width)" style="width:100%;" @click="toggleDialogId(manifest)"/>
          <div v-else id="osd"></div>
          <ve-manifest-popup v-if="!props.noInfoIcon" :manifest="manifests[0].id"></ve-manifest-popup>
        </div>
        
        <!-- image Grid -->
        <div v-else-if="type === 'image-grid'" :class="`grid-wrapper${props.small ? ' small' : ''}`">
          <template v-for="item, idx in itemsList">
            
            <ve-media-card v-if="props.cards" style="width:100%;height:100%;" :manifest="item.src"></ve-media-card>

            <div v-else>
              <div class="media-item" :draggable="type === 'image'" @dragstart="onDrag(manifestsById[item.id], $event)">
                <img v-if="item.iiif" :data-id="item.id" :src="thumbnail(manifestsById[item.id], 400, item.seq || 1)" @click="toggleDialogId(item)"/>
                <img v-else-if="item.youtube" :src="`https://img.youtube.com/vi/${item.videoid}/0.jpg`" @click="toggleDialogId(item)"/>
                <ve-manifest-popup v-if="item.iiif" :manifest="item.src"></ve-manifest-popup>
              </div>
            </div>

          </template>
        </div>

        <!-- image Compare -->
        <div v-else-if="type === 'image-compare'">
          <sl-image-comparer>
            <img v-for="src, idx in scaledImages" :key="`img-${idx}`" :slot="idx === 0 ? 'before' : 'after'" :src="src" :alt="label(manifests[idx])" />
          </sl-image-comparer>
        </div>

        <!-- HTML5 Audio -->
        <div v-else-if="type === 'audio'" class="media-item">
          <audio id="html5-player" controls>
            <source :src="src" :type="mime"/>
          </audio>
          <ve-manifest-popup v-if="!props.noInfoIcon" :manifest="manifests[0].id"></ve-manifest-popup>
        </div>

        <!-- Video -->
        <div v-else-if="type === 'video'" class="media-item">
      
          <div v-if="isYouTube" id="youtube-placeholder"></div>

          <div v-else-if="isVimeo" id="ve-video-vimeo" data-vimeo-playsinline="true"></div>

          <template v-else>

            <video id="html5-player" controls playsinline :muted="props.muted" :autoplay="props.autoplay" :poster="props.poster">
              <source :src="src" :type="mime"/>
            </video>
            <ve-manifest-popup v-if="!props.noInfoIcon" :manifest="manifests[0].id"></ve-manifest-popup>

          </template>

        </div>

      </div>

      <ve-pager v-if="type === 'image' && totalImages > 1" :total="totalImages" :current="currentImage" @image-selected="onPageChange"></ve-pager>

      <div v-if="caption && !props.noCaption" id="caption-bar" @click="onInfoClick">
        <div v-if="type === 'image'" id="annotations-icon" class="button-icon-with-badge" @click="toggleAnnotations">
          
          <template v-if="annotationsEditable" >
            <sl-icon-button v-if="annotationsVisible" name="chat-square" label="Hide annotations"></sl-icon-button>
            <sl-icon-button v-else name="pencil" label="Edit annotations"></sl-icon-button>
            <sl-badge v-if="!annotationsVisible && annotations.length > 0" variant="danger" pill>{{annotations.length}}</sl-badge>
          </template>
          <template v-else-if="annotations.length > 0" >
            <sl-icon-button v-if="annotationsVisible" name="chat-square" label="Hide annotations"></sl-icon-button>
            <sl-icon-button v-else name="chat-square-text" label="Show annotations"></sl-icon-button>
            <sl-badge v-if="!annotationsVisible" variant="danger" pill>{{annotations.length}}</sl-badge>
          </template>
       </div>
        <div class="label" v-html="caption"></div>
      </div>

      <div v-if="coords" id="coords" v-html="coords" @click="copyTextToClipboard(coords || '')"></div>

    </div>

    <sl-dialog id="media-dialog" no-header style="--body-spacing:0;--footer-spacing:0;">
      <ve-media v-if="dialogId" :src="dialogId" zoom-on-scroll></ve-media>
      <sl-button slot="footer" class="close" @click="toggleDialogId" variant="primary">Close</sl-button>
    </sl-dialog>
  
  </div>
</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
  import YouTubePlayer from 'youtube-player'
  import VimeoPlayer from '@vimeo/player'
  import OpenSeadragon, { TiledImage } from 'openseadragon'
  import OpenSeadragonViewerInputHook from '@openseadragon-imaging/openseadragon-viewerinputhook'

  import { getItemInfo, imageCount, isMobile, loadManifests, label, makeSticky, parseRegionString, sha256, staticImage, thumbnail, top } from '../utils'
  import { Annotator } from '../annotator'

  import '@shoelace-style/shoelace/dist/components/badge/badge.js'
  import '@shoelace-style/shoelace/dist/components/button/button.js'
  import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
  import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
  import '@shoelace-style/shoelace/dist/components/image-comparer/image-comparer.js'
  import '@shoelace-style/shoelace/dist/components/popup/popup'

  import type SLDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
  // import { GithubClient } from '@/gh-utils'

  function onDrag(manifest:any, evt:DragEvent) {
    evt.stopPropagation()
    let url = `https://iiif.juncture-digital.org/?manifest=${manifest.id}`
    evt.dataTransfer?.setData('text/uri-list', url)
  }

  const props = defineProps({
    manifest: { type: String },
    src: { type: String },
    seq: { type: Number, default: 1 },
    annoBase: { type: String },
    base: { type: String },
    region: { type: String },
    size: { type: String },
    rotation: { type: String },
    quality: { type: String },
    format: { type: String },
    options: { type: String },
    alt: { type: String },
    caption: { type: String },
    fit: { type: String },
    entities: { type: String },
    zoomOnScroll: { type: Boolean },
    noCaption: { type: Boolean },
    noInfoIcon: { type: Boolean },
    editable: { type: Boolean },

    static: { type: Boolean },

    // Multiple display options
    grid: { type: Boolean },
    cards: { type: Boolean },
    compare: { type: Boolean },
    small: { type: Boolean },

    // Positioning props
    position: { type: String },
    full: { type: Boolean },
    left: { type: Boolean  },
    right: { type: Boolean },
    sticky: { type: Boolean  },
    width: { type: String },
    height: { type: String },

    // Video props
    autoplay: { type: Boolean, default: false },
    muted: { type: Boolean, default: true },
    start: { type: Number },
    end: { type: Number },
    poster: { type: String },

    class: { type: String }
  })

  const root = ref<HTMLElement | null>(null)
  const shadowRoot = computed(() => root?.value?.parentNode)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const content = computed(() => shadowRoot.value?.querySelector('#content') as HTMLElement)
  const outer = computed(() => shadowRoot.value?.querySelector('#outer') as HTMLElement)
  const inner = computed(() => shadowRoot.value?.querySelector('#inner') as HTMLElement)

  const entities = ref<string[]>([])

  // watch(host, () => init())
  onMounted(() => init())

  const position:string = props.position || (isMobile() ? 'full' : (props.right ? 'right' : props.left ? 'left' : 'full'))
  
  function doLayout(defaultAspect:number=16/9) {

    if (props.sticky) {
      makeSticky(host.value)
      inner.value.style.paddingTop = '6px'
      outer.value.style.paddingBottom = '6px'
    }

    aspect.value = itemInfo.value
      ? Number((itemInfo.value.width/itemInfo.value.height).toFixed(4))
      : defaultAspect

    host.value.classList.add('ve-component')
    host.value.classList.add(position)
    if (position === 'full') {
      //host.value.style.width = '100%'
    } else {
      host.value.style.float = position
      host.value.style.width = 'calc(50% - 12px)'
    }
    host.value.style.width = window.getComputedStyle(host.value).width

    if (content.value) inner.value.style.width = isMobile() ? '100%' : props.width || '100%'
    nextTick(() => {
      width.value = parseInt(window.getComputedStyle(content.value).width.slice(0,-2))
      content.value.style.width = `${width.value}px`
      content.value.style.height = props.height || (
        type.value === 'image-grid'
          ? ''
          : type.value === 'audio'
            ? '80px'
            : `${Math.round(width?.value / aspect.value)}px`
      )
      height.value = parseInt(window.getComputedStyle(content.value).height.slice(0,-2))

      // Scale height to 40% of window height if sticky
      if (props.sticky && position === 'full' && !(props.width || props.height)) {
        let maxStickyHeight = Math.round(window.innerHeight * .4)
        let computedWidth = Math.ceil(maxStickyHeight * aspect.value)
        //console.log(`type=${type.value} height=${height.value} maxStickyHeight=${maxStickyHeight} computedWidth=${computedWidth}`)
        
        if (type.value === 'image') content.value.style.height = `${maxStickyHeight}px`
        if (type.value !== 'image-grid') inner.value.classList.add('drop-shadow')
        inner.value.style.width = `${computedWidth}px`
        // content.value.style.width = `${computedWidth}px`
      }

      nextTick(() => {
        width.value = parseInt(window.getComputedStyle(inner.value).width.slice(0,-2))
        height.value = parseInt(window.getComputedStyle(content.value).height.slice(0,-2))
        // console.log(`position=${position} width=${width.value} height=${height.value} aspect=${aspect.value}`)
      })
    })

  }

  /*
  watch(entities, async () => {
    if (entities.value.length > 0 && !entity.value) {
      entity.value = await getEntity(entities.value[0])
      if (entity.value) {
        console.log(toRaw(entity.value))
      }
    }
  })
  */

  function init() {
    entities.value = props.entities ? props.entities.split(/\s+/).filter(qid => qid) : []
    if (props.src) {
      if (props.src?.indexOf('http') === 0) {
        let srcUrl = new URL(props.src)
        let domain = srcUrl.hostname.replace(/^www\./, '')
        if (youtubeDomains.has(domain)) {
          type.value = 'video'
          isYouTube = true
          videoId.value = srcUrl.searchParams.get('v')
          nextTick(() => initializeYouTubePlayer())
        } else if (vimeoDomains.has(domain)) {
          type.value = 'video'
          isVimeo = true
          videoId.value = srcUrl.pathname.slice(1)
          nextTick(() => initializeVimeoPlayer())
        } else {
          itemsList.value = builditemsList()
        }
      } else {
        itemsList.value = builditemsList()
      }
    } else {
      itemsList.value = builditemsList()
    }
    listenForSlotChanges()
  }

  function onInfoClick(evt:MouseEvent) {
    const popup:any = (evt.target as HTMLElement).parentElement
    if (popup) popup.active = !popup.active;
  }

  /************ OpenSeadragon Image viewer ************/
  const viewer = ref<OpenSeadragon.Viewer>()
  watch(viewer, () => {
    if (viewer.value) {
      let osdViewer = viewer.value
      setTimeout(() => setViewportCoords(), 100)
      osdViewer.addHandler('viewport-change', () => watchCoords())
      if (props.base || props.annoBase) annotator.value = new Annotator(osdViewer, props.base || props.annoBase, annotationsEditable.value)

      let tiledImage = osdViewer.world.getItemAt(0)
      if (tiledImage) {
        if (props.rotation) tiledImage.setRotation(parseInt(props.rotation), true)
        if (tiledImage.getFullyLoaded()) onImageLoaded(tiledImage)
        else tiledImage.addHandler('fully-loaded-change', (evt) => { if (evt.fullyLoaded) onImageLoaded(tiledImage)})
      } else {
          osdViewer.world.addHandler('add-item', () => {
          let tiledImage = osdViewer.world.getItemAt(0)
          if (props.rotation) tiledImage.setRotation(parseInt(props.rotation), true)
          if (tiledImage.getFullyLoaded()) onImageLoaded(tiledImage)
          else tiledImage.addHandler('fully-loaded-change', (evt) => { if (evt.fullyLoaded) onImageLoaded(tiledImage) })
        })
      }
    }
  })

  let loadedImageId: string
  function onImageLoaded(tiledImage:TiledImage) {
    let item = itemsList.value[0]
    let imageId = sha256(itemInfo.value.id || itemInfo.value['@id']).slice(0,8)
    if (imageId !== loadedImageId) {
      if (annotator.value) annotator.value.loadAnnotations(imageId).then((annos: any[]) => annotations.value = annos)
      if (!loadedImageId && item.seq === currentImage.value && item.region) viewer.value?.viewport.fitBounds(parseRegionString(item.region, viewer.value), true)
      // if (item.region) setTimeout(() => viewer.value?.viewport.fitBounds(parseRegionString(item.region, viewer.value), true), 1)
      loadedImageId = imageId
    }
  }

  function isGif(manifest:any) {
    return getItemInfo(manifest).format === 'image/gif'
  }

  /************ Image annotations ************/
  const annotator = ref<any>()
  const annotations = ref<any[]>([])
  const annotationsVisible = ref(false)
  const annotationsEditable = ref(window.location.pathname.split('/')[1] === 'editor' || props.editable)

  function toggleAnnotations() {
    annotationsVisible.value = !annotationsVisible.value
  }
  watch(annotationsVisible, () => {
    annotator.value.setVisible(annotationsVisible.value)
    let annoIcon = shadowRoot.value?.querySelector('#annotations-icon')
    if (annotationsEditable.value && annotationsVisible.value) annoIcon?.classList.add('editable')
    else annoIcon?.classList.remove('editable')
  })

  /************ Image region coords ************/
  const coords = ref<string>()
  
  let coordsDebounce: any = null
  function watchCoords() {
    if (coordsDebounce !== null) {
      clearTimeout(coordsDebounce)
      coordsDebounce = null
    }
    coordsDebounce = window.setTimeout(() => setViewportCoords(), 100)
  }

  function setViewportCoords() {
    const tiledImage = viewer && viewer.value?.world.getItemAt(0)
      if (tiledImage) {
        let bounds = viewer.value?.viewport.getBounds()
        const imageBounds = bounds ? tiledImage.viewportToImageRectangle(bounds) : null
        coords.value = imageBounds
          ? `${Math.ceil(imageBounds.x)},${Math.ceil(imageBounds.y)},${Math.ceil(imageBounds.width)},${Math.ceil(imageBounds.height)}`
          : ''
      }
  }

  /************ Image dialog ************/
  const dialog = ref<SLDialog>()
  watch(shadowRoot, () => {
    dialog.value = shadowRoot.value?.querySelector('#media-dialog') as SLDialog
  })
  watch(dialog, (_dialog) => {
    _dialog?.addEventListener('sl-after-hide', () => dialogId.value = null )
    _dialog?.addEventListener('sl-show', () => {
      if (dialog.value) dialog.value.panel.style.width = isMobile() ? '100%' :`${calcDialogWidth()}px`
    })
  })
  const dialogId = ref<String | null>()
  watch(dialogId, (id) => {
    id ? dialog.value?.show() : dialog.value?.hide()
  })
  function toggleDialogId(item:any=null) {
    // console.log('toggleDialogId', item)
    dialogId.value = dialogId.value ? null : item.src || item.id
  }

  function calcDialogWidth() {
    let width = Math.round(window.innerWidth - 100)
    let maxHeight = Math.round(window.innerHeight - 150)
    let selectedSrc = dialogId.value?.indexOf('http') === 0 ? dialogId.value : `https://iiif.juncture-digital.org/${dialogId.value}/manifest.json`
    let manifestId = manifests.value.find((m:any) => decodeURIComponent(m.id) === selectedSrc)
    if (manifestId) {
      let _imageInfo = getItemInfo(manifestId)
      let _imageAspect = Number((_imageInfo.width/_imageInfo.height).toFixed(4))
      width = _imageAspect >= 1
        ? width / _imageAspect > maxHeight ? width = maxHeight * _imageAspect : width
        : Math.round(maxHeight * _imageAspect)
    }
    // console.log(`calcDialogWidth: width=${width} manifestId=${manifestId}`)
    return width
  }

  const caption = ref(props.caption)

  const currentImage = ref(props.seq)
  const totalImages = ref(props.seq)
  function onPageChange(evt:CustomEvent) { currentImage.value = evt.detail }

  const width = ref<number>(0)
  const height = ref<number>(0)
  const aspect = ref<number>(0)

  const itemsList = ref(<any[]>[])
  const manifests:any = ref([])
  const manifest:any = ref(null)
  const options:any = ref(null)
  const itemInfo:any = ref(null)
  const type:any = ref(null)
  const tileSource:any = ref(null)

  const manifestsById = computed(() => {
    return Object.fromEntries(manifests.value.map((_manifest:any) => [sha256(decodeURIComponent(_manifest.id)).slice(0,8), _manifest]))
  })

  watch(itemsList, () => {
    // console.log(toRaw(itemsList.value))
    let manifestUrls = itemsList.value.filter(item => item.iiif).map(item => item.src)
    loadManifests(manifestUrls).then(resp => {
      manifests.value = resp
      if (props.grid) type.value = 'image-grid'
      else if (manifests.value.length > 1) type.value = manifests.value.length === 2 ? 'image-compare' : 'image-grid'
    })
  })

  watch(manifests, () => {
    manifest.value = manifests.value.length > 0 && manifests.value[0]
    options.value = itemsList.value[0]
  })
  watch(manifest, () => {
    totalImages.value = imageCount(manifest.value)
    itemInfo.value = manifest.value ? getItemInfo(manifest.value, currentImage.value) : null
  })
  watch(currentImage, () => itemInfo.value = manifest.value ? getItemInfo(manifest.value, currentImage.value) : null)

  const scaledImages = ref<string[]>([])
  
  const src = computed(() => itemInfo.value?.id)
  const mime = computed(() => {
    let fileExtension = src.value?.split('#')[0].split('.').pop()
    return fileExtension === 'mp4'
      ? 'video/mp4'
      : fileExtension === 'webm'
        ? 'video/webm'
        : 'application/ogg'
  })

  watch(itemInfo, () => {
    type.value = type.value || itemInfo.value?.type?.split(':').pop().toLowerCase()
    tileSource.value = type?.value.indexOf('image') === 0
      ? itemInfo.value.service
        // ? `${(itemInfo.value.service[0].id || itemInfo.value.service[0]['@id']).replace(/iiif-image\.juncture-digital.org/)}/info.json`
        ? `${(itemInfo.value.service[0].id || itemInfo.value.service[0]['@id'])}/info.json`
        : { url: itemInfo.value.id, type: 'image', buildPyramid: true }
      : null
    viewer.value && viewer.value.open(tileSource.value)
    if (!width.value) nextTick(() => doLayout())
  })

  watch(type, () => {
    addInteractionHandlers()
    nextTick(() => {
      if (type.value === 'image' && !isGif(manifest.value) && !props.static) loadImage()
      // else if (type.value === 'image-compare') scaledImages.value = scaleImages()
      else if (type.value === 'video' && itemsList.value.length > 0) initializeHTML5Player()
      else if (type.value === 'audio') initializeHTML5Player()
      if (!caption.value && type.value === 'image') caption.value = label(manifest.value)   
    })
  })

  watch(height, () => {
    if (type.value === 'image-compare') scaledImages.value = scaleImages()
  })

  function listenForSlotChanges() {
    let slot = host.value.parentElement.querySelector('ve-media > ul, ve-media > span')
    if (slot) {
      const callback = (mutationsList:any) => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
          }
        }
        itemsList.value = builditemsList()
      }
      const observer = new MutationObserver(callback)
      observer.observe(slot, { childList: true, subtree: true, characterData: true })
    }
  }

  const iiifRegex = RegExp(/^(?<region>(pct:)?([0-9.]+,[0-9.]+,[0-9.]+,[0-9.]+)|full|square)(\/(?<size>full|max|((pct:)?[\d,.!]+)))?(\/(?<rotation>!?\d+))?(\/(?<quality>color|gray|bitonal|default))?(\/(?<format>jpg|tif|png|gif|jp2|pdf|webp))?/)
  const rotationRegex = RegExp(/^(?<mirror>!?)(?<rotation>0|90|180|270){1}/)

  function isIiifArg(str:string) {
    return iiifRegex.test(str)
  }

  function isInt(str:string) {
    return /^[0-9]+$/.test(str)
  }

  function isRotation(str:string) {
    return rotationRegex.test(str)
  }

  function builditemsList() {
    let itemsList:any[] = []
    let src = props.manifest || props.src
    let listItems = Array.from(host.value.querySelectorAll('li') as HTMLUListElement[]).filter(li => li.innerText.trim() !== '')
    if (!src && listItems.length === 0 && entities.value.length > 0) src = `wd:${entities.value[0]}`
    if (src) {
      let obj:any = {}
      obj.src = src
      obj.src = obj.src.indexOf('http') === 0 ? obj.src : `https://iiif.juncture-digital.org/${obj.src}/manifest.json`
      obj.id = sha256(obj.src).slice(0,8)
      let parsedUrl = new URL(obj.src)
      let domain = parsedUrl.hostname.replace(/^www\./, '')
      obj.iiif = !youtubeDomains.has(domain) && !vimeoDomains.has(domain)

      if (props.options && isIiifArg(props.options)) {
        let match = props.options.match(iiifRegex)
        if (match) obj = {...obj, ...match.groups}        
      }
      obj.seq = props.seq
      obj.region = props.region || obj.region
      obj.size = props.size || obj.size
      obj.rotation = props.rotation || obj.rotation
      obj.quality = props.quality || obj.quality
      obj.format = props.format || obj.format
      obj.fit = props.fit
      itemsList.push(obj)
    } else {
      itemsList = listItems
        // .filter(li => li.innerHTML)
        .map(li => {
          let tokens:string[] = []
          let s = li.textContent?.replace(/“/,'"').replace(/”/,'"').replace(/’/,"'").trim()
          s?.match(/[^\s"]+|"([^"]*)"/gmi)?.forEach(token => {
            if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
            else tokens.push(token)
          })
          let obj:any = {}
          if (tokens.length > 0) {
            obj.src = tokens[0].indexOf('http') === 0
              ? tokens[0]
              : tokens[0].indexOf('manifest') === 0
                ? `https://iiif.juncture-digital.org/${tokens[0]}`
                : `https://iiif.juncture-digital.org/${tokens[0]}/manifest.json`
          }
          obj.id = sha256(decodeURIComponent(obj.src)).slice(0,8)

          let parsedUrl = new URL(obj.src)
          let domain = parsedUrl.hostname.replace(/^www\./, '')
          if (youtubeDomains.has(domain)) {
            obj.youtube = true
            obj.videoid = parsedUrl.searchParams.get('v')
          } else if (vimeoDomains.has(domain)) {
            obj.vimeo = true
          } else {
            obj.iiif = true
          }
          obj.iiif = !youtubeDomains.has(domain) && !vimeoDomains.has(domain)
          for (let i = 1; i < tokens.length; i++) {
            let token = tokens[i]
            if (token.indexOf('=') > 0) {
              let split = token.split('=')
              obj[split[0]] = split[1]
            } else if (isInt(token)) {
              obj.seq = token
            } else if (isIiifArg(token)) {
              let match = token.match(iiifRegex)
              if (match) obj = {...obj, ...match.groups}
            } else if (token === 'cover' || token === 'contain') {
              obj.fit = token
            } else if (isRotation(token)) {
              let match = token.match(rotationRegex)
              if (match) obj = {...obj, ...match.groups}
            } else if (token === 'mirror') {
              obj.mirror = true
            } else {
              obj.caption = token[0] === '"' && token[token.length-1] === '"' ? token.slice(1,-1) : token
            }
          }
          return obj
        })
      //Array.from(host.value.querySelectorAll('li') as HTMLUListElement[]).forEach(li => li.parentElement?.removeChild(li))
    }
    return itemsList
  }

  function scaleImages() {
    let targetWidth = width.value
    let targetHeight = height.value
    let targetAspectRatio = aspect.value

    // console.log(`scaleImages: targetWidth=${targetWidth} targetHeight=${targetHeight} targetAspectRatio=${targetAspectRatio}`)

    return itemsList.value.map((img, idx) => {
      
      let imgInfo = getItemInfo(manifests.value[idx], img.seq)

      let x,y,w,h
      if (img.region) {
        [x,y,w,h] = img.region.split(':').pop().split(',').map((s:string) => parseFloat(s))
        let isPct = img.region.split(':')[0] === 'pct'
        if (isPct) {
          x = Math.round(x * imgInfo.width / 100)
          y = Math.round(y * imgInfo.height / 100)
          w = Math.round(w * imgInfo.width / 100)
          h = Math.round(h * imgInfo.height / 100)
        }
      }

      const inputWidth = w || imgInfo.width
      const inputHeight = h || imgInfo.height
      const inputImageAspectRatio = Number((inputWidth/inputHeight).toFixed(4))

      let outputWidth = inputWidth
      let outputHeight = inputHeight

      if (inputImageAspectRatio > targetAspectRatio) {
        outputWidth = Math.round(inputHeight * targetAspectRatio)
        outputHeight = Math.round(outputWidth / targetAspectRatio)
      } else {
        outputHeight = Math.round(inputWidth / targetAspectRatio)
        outputWidth = Math.round(outputHeight * targetAspectRatio)
      }

      let tileSource = imgInfo.service[0].id || imgInfo.service[0]['@id']

      const outputX = (x || 0) + Math.abs(Math.round((outputWidth - inputWidth) * 0.5))
      const outputY = (y || 0) + Math.abs(Math.round((outputHeight - inputHeight) * 0.5))

      let region = `${outputX},${outputY},${outputWidth},${outputHeight}`

      let imgUrl = `${tileSource}/${region}/${targetWidth},${targetHeight}/${img.mirror ? '!' : ''}${img.rotation || 0}/${img.quality || 'default'}.${img.format || 'jpg'}`

      return imgUrl
    })
  }

  function loadImage() {
    viewer.value = initOsdViewer()
    configureImageViewerBehavior()
    tileSource.value && viewer.value.open(tileSource.value)
  }

  function initOsdViewer() {
    let shadowRoot: any = root.value?.parentNode
    let container = shadowRoot.querySelector('#osd')
    const osdOptions: OpenSeadragon.Options = {
      element: container,
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      homeFillsViewer: props.fit === 'cover',
      showNavigationControl: true,
      minZoomImageRatio: 1,
      maxZoomPixelRatio: 10,
      showRotationControl: true,
      showHomeControl: true,
      showZoomControl: true,
      showFullPageControl: true,
      showNavigator: false,
      sequenceMode: true,
      showReferenceStrip: true,
      
      animationTime: 0.5,
      springStiffness: 10,
      
      visibilityRatio: 1.0,
      constrainDuringPan: true
      
    }
    return OpenSeadragon(osdOptions)
  }

  function configureImageViewerBehavior() {
    /* This is intended to provide touch-based scrolling of OSD images in mobile mode.  Pan/zoom is
    disabled to permit scrolling.  The technique for doing this is as described in this
    OSD Github issue - https://github.com/openseadragon/openseadragon/issues/1791#issuecomment-1000045888
    Unfortunately, this only works with OSD v2.4.2, which is not compatible with the latest version of the
    Annotorious plugin (requires 3.0).  As a result, the current configuration is pinned 
    to OSD 2.4.2 and annotorious 2.6.0
    */
    //const canvas: any = this.el.shadowRoot.querySelector('.openseadragon-canvas')
    //canvas.style.touchAction = 'pan-y'

    if (!props.zoomOnScroll) {

      new OpenSeadragonViewerInputHook({ viewer: viewer.value, hooks: [
        {tracker: 'viewer', handler: 'scrollHandler', hookHandler: (event:any) => {
          if (!viewer.value?.isFullPage() && !event.originalEvent.ctrlKey) {
            event.preventDefaultAction = true
            event.stopHandlers = true
          }
          return true
        }}
      ]})

      /*
      new OpenSeadragonViewerInputHook({ viewer: viewer.value, hooks: [
        {tracker: 'viewer', handler: 'clickHandler', hookHandler: (event:any) => {
          if (!viewer.value?.isFullPage() && !event.originalEvent.ctrlKey) {
            event.preventDefaultAction = true
            event.stopHandlers = true
          }
          return true
        }}
      ]})
      */
    }
  }

  function copyTextToClipboard(text: string) {
    if (navigator.clipboard) navigator.clipboard.writeText(text)
  }

  /************ Viewer interactions ************/
  
  function isImageZoomTo(attr:Attr) {
    let name = attr.name.toLowerCase()
    let value = attr.value
     if ((name === 'enter' || name === 'exit') && value.indexOf('|') > 0) [name, value] = value.split('|')
    return ['zoom', 'zoomto'].indexOf(name.toLowerCase()) === 0 || /^((pct:|pixel:|px:)?[\d.]+,[\d.]+,[\d.]+,[\d.]+)?\|?([0-9a-f]{8})?$/.test(value)
  }

  function isPlayMedia(attr:Attr) {
    let name = attr.name.toLowerCase()
    let value = attr.value
    if ((name === 'enter' || name === 'exit') && value.indexOf('|') > 0) [name, value] = value.split('|')
    return name.toLowerCase() === 'play' || /^([0-9:]+)+,?([0-9:]+)?$/.test(value)
  }

  function isPauseMedia(attr:Attr) {
    let name = attr.name.toLowerCase()
    let value = attr.value.toLowerCase()
    return name === 'pause' || value === 'pause'
  }

  const actionKeys = new Set(['anno', 'play', 'start', 'zoomto'])
  function addInteractionHandlers() {
    Array.from(host.value.querySelectorAll('[enter],[exit]') as HTMLElement[]).forEach(el => {
      let veMedia = findVeMedia(el)
      if (veMedia) addMutationObserver(el)
    });

    let el = host.value.parentElement
    while (el.parentElement && el.tagName !== 'BODY') el = el.parentElement;
    (Array.from(el.querySelectorAll('mark, ve-trigger')) as HTMLElement[]).forEach(mark => {
      let match = Array.from(mark.attributes).find(attr => actionKeys.has(attr.name))
      if (match) {
        let veMedia = findVeMedia(mark.parentElement)
        if (veMedia) {
          mark.classList.add(match.name)
          mark.addEventListener('click', () => {
            if (match?.name === 'anno') showAnnotation(match.value)
            else if (match?.name === 'zoomto') zoomto(match.value)
            else if (match?.name === 'play') playMedia(match.value)
            else pauseMedia()
          })
        }
      }
    })
  }

  function findVeMedia(el:any) {
    let sib = el.previousSibling
    while (sib) {
      if (sib.nodeName === 'VE-MEDIA') return sib === host.value ? sib : null
      sib = sib.previousSibling
    }
    while (el.parentElement && el.tagName !== 'MAIN') {
      el = el.parentElement
      let veMedia = el.querySelector(':scope > ve-media, :scope > p > ve-media')
      if (veMedia) return veMedia === host.value ? veMedia : null
    }
  }

  function addMutationObserver(el: HTMLElement) {
    let prevClassState = el.classList.contains('active')
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName == 'class') {
          let currentClassState = (mutation.target as HTMLElement).classList.contains('active')
          if (prevClassState !== currentClassState) {
            prevClassState = currentClassState
            let attr = el.attributes.getNamedItem(currentClassState ? 'enter' : 'exit')
            if (attr) {
              if (type.value === 'image' && isImageZoomTo(attr)) zoomto(attr.value)
              if (type.value !== 'image') {
                if (isPlayMedia(attr)) playMedia(attr.value)
                else if (isPauseMedia(attr)) pauseMedia()
              } 
            }
          }
        }
      })
    })
    observer.observe(el, {attributes: true})
  }

  function playMedia(arg: string) {
    arg = arg.replace(/^play\|/i,'')
    const match = arg.match(/^([0-9:]+)+,?([0-9:]+)?$/)
    if (match) seekTo(match[1], match[2])
  }

  function pauseMedia() {
    pause()
  }

  let zoomedToRegion:string = ''
  function zoomto(arg: string) {
    arg = arg.replace(/^zoomto\|/i,'')
    const match = arg?.match(/^(?<region>(pct:|pixel:|px:)?[\d.]+,[\d.]+,[\d.]+,[\d.]+)?,?(?<annoid>[0-9a-f]{8})?$/)
    if (match) {
      let region = match?.groups?.region
      let annoid = match?.groups?.annoid
      // console.log(`ve-media.zoomto: region=${region} annoid=${annoid}`)
      if (region) {
        if (zoomedToRegion === region) {
          viewer.value?.viewport.goHome()
          zoomedToRegion = ''
        } else {
          zoomedToRegion = region
          annotator.value?.deselect()
          viewer.value?.viewport.fitBounds(parseRegionString(region, viewer.value), false)
        }
        if (annoid) annotator.value.select(annoid)
      } else if (annoid) {
        if (annotator.value.selected?.id === annoid) {
          annotator.value.deselect()
        } else {
          viewer.value?.viewport.goHome()
          if (annoid) annotator.value.select(annoid)
        }
      }
    }
  }

  function showAnnotation(arg:string) {
    const match = arg?.match(/^(?<annoid>[0-9a-f]{8})$/)
    if (match) {
      let annoid = match?.groups?.annoid
      if (annoid && annotator.value.selected?.id === annoid) {
        annotator.value?.deselect()
        viewer.value?.viewport.goHome()
      } else {
        viewer.value?.viewport.goHome()
        annotator.value.select(annoid)
      }
    }
  }

  /******************* Audio/Video Player Methods *******************/

  const youtubeDomains = new Set(['youtube.com', 'youtube.co.uk', 'youtu.be'])
  const vimeoDomains = new Set(['vimeo.com'])

  let mediaPlayer:any = null
  const videoId = ref<string | null>()

  const isMuted = ref(true)
  const isPlaying = ref(false)
  let isYouTube = false
  let isVimeo = false
  let isHTML5 = false
  let timeoutId: any = null
  let forceMuteOnPlay = true
  let startTimes:any = {}
  let sticky = false

  // watch(mediaPlayer, () => monitor())

  function getStartTimes() {
    startTimes.value = Object.fromEntries(
      Array.from(host.value.parentElement.querySelectorAll('p[data-start]'))
        .map((el:any) => [hmsToSeconds(el.dataset.start || '0'), el])
    )
  }

  async function youtubeMetadata(videoId:any) {
    let videoUrl = encodeURI(`https://www.youtube.com/watch?v=${videoId}`)
    let url = `https://youtube.com/oembed?url=${videoUrl}&format=json`
    let resp = await fetch(url)
    let data:any = await resp.json()
    data.aspect = data.width/data.height
    return data
  }

  async function initializeYouTubePlayer() {
    let metadata = await youtubeMetadata(videoId.value)
    getStartTimes()
      nextTick(() => {
        doLayout(metadata.aspect)
        nextTick(() => {
          let playerEl = shadowRoot.value?.querySelector('#youtube-placeholder') as HTMLElement
          let width = parseInt(window.getComputedStyle(playerEl).width.slice(0,-2))
          playerEl.style.height = `${width/metadata.aspect}px`
          let playerVars = {
            color: 'white',
            rel: 0,
            modestbranding: 1,
            playsinline: 1
          }
          mediaPlayer = YouTubePlayer(
            playerEl, {
              videoId: videoId.value,
              width,
              playerVars
            })
          mediaPlayer.on('ready', (evt:any) => {
            // playerEl = shadowRoot.value?.querySelector('#youtube-placeholder') as HTMLElement
            // console.log('post', playerEl.clientWidth, playerEl.clientHeight)
            // doLayout()
            monitor()
            // console.log('youtube.ready', props.autoplay)
            if (props.autoplay) seekTo(`${props.start || ''}`, `${props.end || ''}`)
          })
      })
    })
  }

  async function initializeVimeoPlayer() {
    doLayout()
    let playerEl = shadowRoot.value?.querySelector('#ve-video-vimeo') as HTMLElement
    mediaPlayer = new VimeoPlayer(playerEl, {
      id: videoId.value,
      width: parseInt(window.getComputedStyle(playerEl).width.slice(0,-2))
    })
    mediaPlayer.on('loaded', () => {
      // console.log(`vimeo: width=${playerEl.clientWidth} height=${playerEl.clientHeight}`)
      doLayout(playerEl.clientWidth/playerEl.clientHeight - 5)
      // if (this.startSecs > 0) seekTo(props.start, props.autoplay ? props.end : props.start)
      monitor()
    })
  }

  function initializeHTML5Player() {
    getStartTimes()
    isHTML5 = true
    nextTick(() => {
      mediaPlayer = shadowRoot.value?.querySelector('#html5-player') as HTMLVideoElement
      monitor()
    })
    doLayout()
  }
  async function monitor() {
    let playerEl = host.value.parentElement.querySelector('ve-media') as HTMLElement
    let playerScrolledToTop = false
    
    setInterval(async () => {
      isMuted.value = await getIsMuted()
      isPlaying.value = await getIsPlaying()

      // console.log(`ve-media: isPlaying=${isPlaying.value} sticky=${props.sticky} startTimes=${Object.keys(startTimes.value).length} playerScrolledToTop=${playerScrolledToTop}`)
      if (isPlaying.value && props.sticky && Object.keys(startTimes.value).length > 0 && !playerScrolledToTop ) {
        // scroll player to top
        let y = playerEl.getBoundingClientRect().top + window.scrollY - top()
        // console.log('scrollTo', y)
        window.scrollTo(0, y)
        playerScrolledToTop = true
      }

      if (isPlaying.value) {
        getCurrentTime().then(time => {
          time = Math.round(time)
          // console.log(`${type.value}: isMuted=${isMuted.value} isPlaying=${isPlaying.value} currentTime=${time}`)
          if (startTimes.value[time]) {
            // scroll paragraph into active region
            let p = startTimes.value[time] as HTMLParagraphElement
            let bcr = p.getBoundingClientRect()
            window.scrollTo(0, bcr.top + window.scrollY - playerEl.getBoundingClientRect().bottom)
          }
        })
      }
    }, 1000)
  }

  function play() {
    if (isYouTube) mediaPlayer.playVideo()
    else if (isVimeo) mediaPlayer.play()
    else if (isHTML5) mediaPlayer.play()
  }

  function pause() {
    if (isYouTube) mediaPlayer.pauseVideo()
    else if (isVimeo) mediaPlayer.pause()
    else if (isHTML5) mediaPlayer.pause()
  }

  async function getCurrentTime() {
    if (isYouTube) return mediaPlayer.getCurrentTime()
    else if (isVimeo) return await mediaPlayer.getCurrentTime()
    else if (isHTML5) return mediaPlayer.currentTime
  }

  async function getIsPlaying() {
    if (isYouTube) return await mediaPlayer.getPlayerState() === 1
    else if (isVimeo) {
      return !(await mediaPlayer.getEnded() || await mediaPlayer.getPaused())
    }
    else if (isHTML5) {
      return ! (mediaPlayer.ended || mediaPlayer.paused)
    }
    return false
  }

  async function getIsMuted() {
    if (isYouTube) return await mediaPlayer.isMuted()
    else if (isVimeo) return await mediaPlayer.getMuted()
    else return await props.muted
  }

  function setMuted(mute:boolean) {
    if (isYouTube) {
      if (mute) mediaPlayer.mute()
      else mediaPlayer.unMute()
    } 
    else if (isVimeo) mediaPlayer.setMuted(mute)
    else if (isHTML5) mediaPlayer.muted = mute
  }

  function hmsToSeconds(str:string) {
    var p = str.split(':').slice(0,3).map(pe => parseInt(pe, 10))
    let secs = 0, m = 1
    while (p.length > 0) {
      let val = p.pop() || 0 
      secs += m * val
      m *= 60
    }
    return secs
  }

  function seekTo(start:string, end:string='') {
    // console.log(`seekTo: start=${start} end=${end}`)
    let startSecs = hmsToSeconds(start)
    let endSecs = end ? hmsToSeconds(end) + 1 : -1
    // console.log(`seekTo: start=${startSecs} startElem=${startTimes.value[startSecs] !== undefined} end=${endSecs} isMuted=${isMuted.value} forceMuteOnPlay=${forceMuteOnPlay}`)

    // clear delayed pause
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    let wasMuted = isMuted.value
    // if (forceMuteOnPlay) setMuted(true)

    if (isYouTube) {
      mediaPlayer.playVideo()
      mediaPlayer.seekTo(startSecs).then((_:any) => {
        if (endSecs >= startSecs) {
          timeoutId = setTimeout(() => {
            mediaPlayer.pauseVideo().then((_:any) => {
              timeoutId = null
              if (!wasMuted && forceMuteOnPlay) setMuted(false)
            })
          }, endSecs === startSecs ? 200 : (endSecs-startSecs)*1000)
        }
      })
    }
  
    else if (isVimeo) {
      mediaPlayer.setCurrentTime(startSecs)
      mediaPlayer.play().then((_:any) => {
        if (endSecs >= startSecs) {
          timeoutId = setTimeout(() => {
            mediaPlayer.pause().then((_:any) => {
              timeoutId = null
              if (!wasMuted && forceMuteOnPlay) setMuted(false)
            })
          }, endSecs === startSecs ? 200 : (endSecs-startSecs)*1000)
        }
      })
    }

    else if (isHTML5) {
      setTimeout(() => {
        mediaPlayer.play()
        mediaPlayer.currentTime = startSecs
        if (endSecs >= startSecs) {
          timeoutId = setTimeout(() => {
            timeoutId = null
            mediaPlayer.pause()
            if (!wasMuted && forceMuteOnPlay) setMuted(false)
          }, endSecs === startSecs ? 200 : (endSecs-startSecs)*1000)
        }
      }, 200)
    } 

    if (startTimes.value[startSecs]) {
      // scroll paragraph into active region
      let p = startTimes.value[startSecs] as HTMLParagraphElement
      let bcr = p.getBoundingClientRect()
      // console.log(`elem.scrollTo`, bcr.top)
      let playerEl = host.value.parentElement.querySelector('ve-media') as HTMLElement
      window.scrollTo(0, bcr.top + window.scrollY - playerEl.getBoundingClientRect().bottom)
    }

  }

  /******************* End Audio/Video Player Methods *******************/

</script>

<style>

  @import '../annotator/annotorious.css';

  * { box-sizing: border-box; }

  :host {
    display: block;
    padding-bottom: 6px;
    background-color: inherit;
  }

  .info-icon {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 24px;
    height: 24px;
    font-size: 20px;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    background-color: white;
    display: flex;
    justify-content: center;
    visibility: hidden;
  }
  .media-item:hover .info-icon {
    visibility: visible;
    transition: all 0.3s ease-in;
  }

  .manifest-popover {
    background-color: white;
    border-radius: 6px;
    width: 300px;
    height: 400px;
    overflow-y: scroll;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }

  #outer {
    position: relative;
    /* overflow: hidden; */
    width: 100%;
    background-color: inherit;
    display: flex;
    justify-items: center;
  }

  #outer {
    margin-bottom: 12px;
    /* box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px; */

  }

  #inner {
    margin: auto;
    width: 100%;
  }

  #inner.image {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }

  .drop-shadow {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }

  #content {
    width: 100%;
  }

  #osd, video {
    width: 100%;
    height: 100%;
  }

  #caption-bar {
    display: flex;
    gap: 6px;
    width: 100%;
    align-items: center;
    height: 32px;
    background-color: #555;
  }

  #caption-bar .label {
    color: white;
    padding: 0 9px;
    font-size: 1.1rem;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
  }

  .image-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .grid-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-auto-rows: 1fr;

    grid-gap: 18px;
    align-items: flex-start;
    justify-items: center;
    /* padding: 12px 0;
    width: 100%;
    margin: 24px 0; */
  }

  .grid-wrapper.small {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-auto-rows: 1fr;

    grid-gap: 18px;
    align-items: flex-start;
    justify-items: center;
    /* padding: 12px 0;
    width: 100%;
    margin: 24px 0; */
  }

  .grid-wrapper > .caption {
    display: flex;
    align-items: center;
    font-family: sans-serif;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 6px;
    bottom: 0;
    height: 32px;
    margin-top: 6px;
  }

  .grid-wrapper img {
    border: 1px solid #ccc;
    box-shadow: 2px 2px 6px 0px  rgba(0,0,0,0.3);
    /* width: 240px; */
    max-width: 100%;
    cursor: pointer;
  }

  #coords {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: sans-serif;
    bottom: 0;
    right: 0;
    width: 130px;
    height: 32px;
    padding: 3px 6px;
    font-size: 0.8rem;
    background-color: rgba(255, 255, 255, 0.5);
    color: black;
    z-index: 2;
    opacity: 0;
    text-align: right;
  }
  #coords:hover {
    visibility: visible;
    opacity: 1;
    transition: all 0.3s ease-in;
    cursor: copy;
  }

  .info-icon span {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    z-index: 2;
    opacity: 0;
    border-radius: 50%;
    border: 1px solid white;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .media-item {
    position: relative;
  }
  .media-item:hover .info-icon span {
    visibility: visible;
    opacity: 1;
    transition: all 0.3s ease-in;
    cursor: pointer;
    color: white;
  }

  .info-icon:hover svg {
    fill: black;
  }

  .view .r6o-footer {
    display: none;
  }
  .r6o-widget.comment .r6o-readonly-comment {
    display: inline;
    padding: 0;
  }
  .view .r6o-editor, 
  .view .r6o-editor-inner, 
  .view .r6o-widget {
    display: inline-block;
    min-height: unset !important;
    line-height: 1.4;
    padding: 0px;
    border-bottom: none;
  }

  .r6o-tag,
  .comment.editable:nth-of-type(2) {
    display: none !important;
  }
  .edit .r6o-editor {
    width: 216px;
  }

  .r6o-widget.comment {
    padding: 6px 6px 4px 6px;
    border-radius: 4px;
  }


  /** New style for the annotation outlines **/
  svg.a9s-annotationlayer .a9s-selection .a9s-inner,
  svg.a9s-annotationlayer .a9s-annotation .a9s-inner  {
    stroke-width: 3;
    stroke: rgba(255,255,0,1.0);
  }

  ul.annotations {
    list-style: none;
    padding-left: 0;
  }
  .annotations li {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 0;
  }

  .annotations li:hover {
    background-color: rgba(255,255,255,0.2);
    cursor: pointer;
  }

  .compare{
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    border: 5px solid #bfc0c1;
    box-shadow:-3px 5px 15px #000;

  }
  .compare img {
      width: 100%;
      height: 100%;
      position: absolute;
  }
  #compare-img-2{
      clip-path: polygon(0 0 , 50% 0, 50% 100%, 0 100%);
  }
  #slider {
      position: relative;
      -webkit-appearance: none;
      width: calc( 100% + 40px);
      height: 100%;
      margin-left: -20px;
      background-color: transparent;
      outline: none;
  }
  #slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 45px;
      width: 45px;
      /* background: url("@/assets/img/split-cells.svg"), rgba(255,255,255,0.3); */
      background: rgba(255,255,255,0.3);
      border: 4px solid white;
      border-radius: 50%;
      background-size: contain;
      cursor: pointer;
  }

  audio#html5-player {
    width: calc(100% - 60px);
    max-width: 50vh;
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }

  /* The Close Button */
  .close {
    font-size: 14px;
    font-weight: bold;
    padding: 6px;;
  }

  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }

  .popup-overview sl-popup {
    --arrow-color: var(--sl-color-primary-600);
  }

  .popup-overview span[slot='anchor'] {
    display: inline-block;
    width: 150px;
    height: 150px;
    border: dashed 2px var(--sl-color-neutral-600);
    margin: 50px;
  }

  .popup-overview .box {
    width: 100px;
    height: 50px;
    background: var(--sl-color-primary-600);
    border-radius: var(--sl-border-radius-medium);
  }

  .popup-overview-options {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: 1rem;
  }

  .popup-overview-options sl-select {
    width: 160px;
  }

  .popup-overview-options sl-input {
    width: 100px;
  }

  .popup-overview-options + .popup-overview-options {
    margin-top: 1rem;
  }

  sl-popup {
    --arrow-color: var(--sl-color-primary-600);
  }

  .media-item .box {
    width: 300px;
    height: 600px;
    background: white;
    border-radius: var(--sl-border-radius-medium);
  }

  #annotations-icon {
    position: relative;
    cursor: pointer;
  }

  #annotations-icon {
    position: relative;
    cursor: pointer;
  }

  #annotations-icon sl-icon-button::part(base) {
    color: white;
    font-size: 1.2rem;
    padding: 3px;
  }

  .button-icon-with-badge {
    display: inline-block;
    position: relative;
    /* width: 50px; */
    margin: 0 6px;
  }

  .button-icon-with-badge sl-badge {
    position: absolute;
    left: 70%;
    top: 0;
    cursor: pointer;

  }
  .button-icon-with-badge sl-badge::part(base) {
    font-size: .7rem;
    background-color: yellow;
    color: black;
    font-weight: bold;
    padding: 4px 5px 1px 5px;
    border: unset;
  }

  #youtube-placeholder, #ve-video-vimeo {
    width: 100%;
  }

  ve-manifest-popup {
    position: absolute;
    top: 12px;
    right: 12px;
    visibility: hidden;
    opacity: 0;
    cursor: pointer;
  }

  .media-item:hover ve-manifest-popup {
    visibility: visible;
    opacity: 0.8;
    transition: all .5s ease-in;
  }

</style>

