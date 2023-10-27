<template>

  <div ref="root" class="main">
    <img 
      :src="props.src" i
      id="gif" 
      style="width:100%;" 
      :alt="props.alt || 'Animated GIF'"
      @click="onClick('image', $event)"
    />
    <sl-icon
      v-if="ready"
      id="play-button"
      :name="isPlaying ? 'pause-circle' : 'play-circle'" 
      :data-state="isPlaying ? 'playing' : 'paused'"
      style="font-size:100px"
      @click="onClick('icon', $event)"
    ></sl-icon>
  </div>
  
</template>
  
<script setup lang="ts">

  import { computed, nextTick, ref, watch } from 'vue'
  import '@shoelace-style/shoelace/dist/components/icon/icon.js'

  const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String },
    initiallyPaused: { type: Boolean },
    restartOnPlay: { type: Boolean }
  })

  const root = ref<HTMLElement | null>(null)
  const shadowRoot = computed(() => root?.value?.parentNode as HTMLElement)
  const gif = computed(() => shadowRoot.value?.querySelector('#gif') as HTMLImageElement)
  
  const ready = ref(false)
  const isPlaying = ref(false)

  const options = ref<any>()

  const defaultConfig = {
    buttonPlayIconID: '',
    buttonPauseIconID: '',
    buttonPlayIconHTML: '',
    buttonPauseIconHTML: '',
    inheritClasses: true,
    initiallyPaused: false,
    restartOnPlay: false,
    langPause: 'Pause animation:',
    langPlay: 'Play animation:',
    langPauseAllButton: 'Pause all animations',
    langPlayAllButton: 'Play all animations',
    langMissingAlt: 'Animated GIF.'
  }

  watch(gif, () => {
    nextTick(() => init())
  })

  function init() {
    options.value = { 
      ...defaultConfig,
      ...{
        initiallyPaused: props.initiallyPaused,
        restartOnPlay: props.restartOnPlay
    }}
    generateStill()
  }

	function generateStill () {

    let waitForImage = () => {
      ready.value = true
      let ext
      ext = gif.value.src.split('.')
      ext = ext[ext.length - 1].toLowerCase()
      ext = ext.substring(0, 4)
      if (ext === 'gif') {
        const canvas = document.createElement('canvas')

        //Calculate total border width... otherwise layout shifts.
        let borderLeft = parseFloat(
            getComputedStyle(gif.value, null).getPropertyValue('border-left-width')
          ),
          borderRight = parseFloat(
            getComputedStyle(gif.value, null).getPropertyValue('border-right-width')
          ),
          totalBorderWidth = borderLeft + borderRight,
          gifWidth = gif.value.getAttribute('width')

        //If width wasn't manually specified on GIF.
        if (gifWidth !== null) {
          canvas.width = parseInt(gifWidth)

          //Prevent layout shifts when width is manually specified on image.
          canvas.setAttribute('style', 'width:' + gifWidth + 'px !important;')
        } else {

          //If rendered or clientWidth of image is 0, use naturalWidth as fallback.
          if (gif.value.clientWidth == 0) {
            canvas.width = gif.value.naturalWidth + 0.5 + totalBorderWidth
          } else {
            //Why 0.5? Apparently canvas calculates from half a pixel... otherwise layout shifts. Thanks to: https://stackoverflow.com/a/13879402
            canvas.width = gif.value.clientWidth + 0.5 + totalBorderWidth
          }
        }

        // Calculate gif height keeping aspect ratio.
        const newHeight = ( gif.value.naturalHeight / gif.value.naturalWidth ) * canvas.width
        canvas.height = newHeight + 0.5

        canvas.setAttribute('role', 'img')

        //Grab all classes from the original image.
        if (options.value.inheritClasses === true) {
          let cssClasses = gif.value.getAttribute('class')
          if (cssClasses == null) cssClasses = ''
          canvas.setAttribute('class', 'gifa11y-canvas' + ' ' + cssClasses)
        } else {
          canvas.setAttribute('class', 'gifa11y-canvas')
        }

        //Set alt on canvas.
        let alt = gif.value.getAttribute('alt') || options.value.langMissingAlt
        canvas.setAttribute('aria-label', alt)

        const filename = gif.value.src,
          mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        //If content author wants GIF to be paused initially (or prefers reduced motion).
        if (
          !mediaQuery ||
          mediaQuery.matches ||
          gif.value.classList.contains('gifa11y-paused') ||
          filename.indexOf('gifa11y-paused') > -1 ||
          options.value.initiallyPaused === true
        ) {
          gif.value.style.display = 'none'
        } else {
          canvas.style.display = 'none'
        }

        //Generate canvas and insert after GIF.
        const canvasContext:any = canvas.getContext('2d')
        canvasContext.drawImage(gif.value, 0, 0, canvas.width, canvas.height)
        gif.value.after(canvas)
      }
      
    }

    //Timing is important. Wait for each image to load before generating a still.
    if (gif.value.complete) waitForImage()
    else gif.value.addEventListener('load', () => {
      // console.log(`onLoad gif.complete=${gif.value.complete}`)
      if (!ready.value) nextTick(() => waitForImage())
    })
  }

  function onClick(from:string, evt:MouseEvent) {
    // console.log(`onClick from=${from} isPlaying=${isPlaying.value} restartOnPlay=${options.value.restartOnPlay}`, evt)
    isPlaying.value = !isPlaying.value

    const canvas = gif.value.nextElementSibling as HTMLCanvasElement

    if (isPlaying.value) {
      if (options.value.restartOnPlay) gif.value.src = props.src
      gif.value.style.display = 'block'
      canvas.style.display = 'none'
    } else {
      if (options.value.restartOnPlay) gif.value.src = props.src
      gif.value.style.display = 'none'
      canvas.style.display = 'block'
    }
    evt.preventDefault();
  }

</script>

<style>

  .main {
    position: relative;
  }

  canvas.gifa11y-canvas {
    object-fit: contain;
    max-width: 100%;
  }

  #play-button {
    position: absolute;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
    color: white;
    visibility: hidden;
    background-color: rgba(0,0,0,.4);
    border-radius: 50%;
  }

  #play-button:hover {
    cursor: pointer;
  }

  #play-button[data-state="paused"] {
    visibility: visible;
  }

  .main:hover #play-button {
    visibility: visible;
  }

</style>