<template>

  <section ref="root" class="ve-hero media-item">
    <ve-manifest-popup :manifest="manifest?.id"></ve-manifest-popup>
  </section>

</template>
  
<script setup lang="ts">

  import { computed, ref, toRaw, watch } from 'vue'
  import { getManifest, imageDataUrl, getItemInfo, parseImageOptions } from '../utils'

  const props = defineProps({
    background: { type: String },
    options: { type: String },
    position: { type: String, default: 'center' },
    sticky: { type: Boolean, default: false },
    height: { type: Number, default: 350 },
    top: { type: Number, default: 0 },
  })
  
  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)

  const manifest = ref<any>()
  const imageOptions = ref<any>()
  const imageInfo = ref<any>()
  const imgUrl = ref<string>()

  watch(props, () => {
    if (props.sticky) {
      host.value.style.position = 'sticky'
      host.value.style.top = '-320px'
    } 
  })

  watch(host, () => {
    // console.log(toRaw(host.value))
    imageOptions.value = parseImageOptions(props.options || '')
    if (props.background) getManifest(props.background).then(_manifest => manifest.value = _manifest)
    host.value.style.height = `${props.height}px`
    if (props.sticky) host.value.style.position = 'sticky'
    if (props.top) host.value.style.top = `-${props.top}px`
  })

  watch(manifest, (val: object, priorVal: object) => {
    if (val !== priorVal) imageInfo.value = getItemInfo(val)
  })

  watch(imageInfo, async (val: any, priorVal: any) => {
    if (val !== priorVal) {
      imgUrl.value = val.service
        ? iiifUrl(val.service[0].id || val.service[0]['@id'], imageOptions.value)
        : await imageDataUrl(imageInfo.value.id, imageOptions.value.region, {width: host.value.clientWidth, height: props.height})
    }
  })

  watch(imgUrl, () => {
    host.value.style.backgroundImage = `url("${imgUrl.value}")`
    host.value.style.backgroundPosition = props.position
  })

  function iiifUrl(serviceUrl: string, options: any) {
    let _imageInfo = imageInfo.value
    let _imageAspect = Number((_imageInfo.width/_imageInfo.height).toFixed(4))
    let width = Math.min(800, host.value.clientWidth)
    let height =  Number(width / _imageAspect).toFixed(0)
    let size = `${width},${height}`
    let url = `${serviceUrl.replace(/\/info.json$/,'')}/${options.region}/${size}/${options.rotation}/${options.quality}.${options.format}`
    return url
  }

</script>

<style>

  * { box-sizing: border-box; }

  :host {
    display: block;
    position: relative;
    width: 100%;
    z-index: 10;
  }

  .ve-hero {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    z-index: 8;
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