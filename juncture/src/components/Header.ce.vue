<template>

    <div v-bind="$attrs"></div>
    
    <ve-hero v-if="backgroundImage"
      :background="backgroundImage"
      :options="props.options"
      :position="props.position"
      :sticky="props.sticky ? '' : null"
      :height="height"
      :top="props.sticky ? height - navbarHeight : 0"
    ></ve-hero>

    <ve-navbar ref="navbar"
      class="sticky z-10"
      :label="label"
      :subtitle="props.subtitle"
      :logo="props.logo"
      :url="props.url"
      :sticky="props.sticky ? '' : null"
      :search-domain="props.searchDomain"
      :search-cx="props.searchCx"
      :search-key="props.searchKey"
      :contact="props.contact"
      :height="backgroundImage ? navbarHeight : height"
      :background="backgroundColor"
      :alpha="backgroundImage ? 0.2 : 0"
      :offset="backgroundImage ? navbarHeight : 0"
    >

      <ul v-if="navEl" v-html="navEl.outerHTML"></ul>

    </ve-navbar>

</template>
  
<script setup lang="ts">

  import { computed, onMounted, onUpdated, ref, toRaw, watch } from 'vue'
  import { isURL, getEntity } from '../utils'
  
  const props = defineProps({
    label: { type: String },
    subtitle: { type: String },
    logo: { type: String },
    url: { type: String },
    contact: { type: String },
    searchDomain: { type: String },
    searchCx: { type: String },
    searchKey: { type: String },
    entities: { type: String },
    sticky: { type: Boolean },
    background: { type: String },
    options: { type: String },
    height: { type: Number },
    position: { type: String }
  })

  const navbarHeight = 100
  const heroHeight = 400
  const manifestShorthandRegex = /^\w+:/

  const navbar = ref<HTMLElement | null>(null)
  const host = computed(() => (navbar.value?.getRootNode() as any)?.host)
  watch(host, () => { navEl.value = host.value.querySelector('ul') })

  const label = ref<string>()
  // const navEl = ref<string>()
  const entities = ref<string[]>([])
  const entity = ref<any>()
  const backgroundColor = ref<string>('#444A1E')
  const backgroundImage = ref<string>()

  const navEl = ref<HTMLUListElement>()
  // watch(navEl, () => { console.log(toRaw(navEl.value)) })

  const height = ref(props.height || navbarHeight)

  onMounted(() => {
    console.log('mounted')
    applyProps() 
  })
  onUpdated(() => applyProps() )

  function applyProps() {
    entities.value = props.entities ? props.entities.split(/\s+/).filter(qid => qid) : []
    if (props.background !== undefined && (isURL(props.background) || isManifestShorthand(props.background))) {
      backgroundImage.value = props.background
      height.value = props.height || heroHeight
    } else {
      backgroundColor.value = props.background || '#444'
    }
    if (props.label && props.label !== 'static') label.value = props.label
    // if (navbar.value) navbar.value.style.height = `${props.height || navbarHeight}px`
    if (props.sticky) host.value.classList.add('sticky')
    // navEl.value = (host.value.querySelector('ul') as HTMLUListElement)?.innerHTML
  }

  watch(entities, async () => {
    if (entities.value.length > 0 && !entity.value) {
      entity.value = await getEntity(entities.value[0])
      if (entity.value) {
        label.value = entity.value.label
        if (entity.value.pageBanner) {
          backgroundImage.value = `https://iiif.juncture-digital.org/wc:${decodeURIComponent(entity.value.pageBanner.split('/Special:FilePath/').pop()).replace(/\s/,'_')}/manifest.json`
          height.value = heroHeight
        }
      }
    }
  })

  function isManifestShorthand(s:string) {
    return manifestShorthandRegex.test(s) 
  }

</script>

<style>
  @import '../tailwind.css';
</style>
