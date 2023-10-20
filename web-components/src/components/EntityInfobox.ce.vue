<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'
  import { Md5 } from 'ts-md5'

  // @ts-ignore
  import { HSTooltip } from '../lib/preline/components/hs-tooltip'

  const props = defineProps({
    qid: { type: String },
    label: { type: String },
    description: { type: String },
    language: { type: String, default: 'en' }
  })
  watch(props, () => { qid.value = props.qid })
  
  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const text = computed(() => host.value?.textContent)

  const shadowRoot = computed(() => root?.value?.parentNode as HTMLElement)
  watch(shadowRoot, () => { new HSTooltip(shadowRoot.value).init() })

  const qid = ref(props.qid)
  watch(qid, () => { getEntity(qid.value) })

  const entities = ref<any>({})
  const entity = computed(() => qid.value && entities.value[qid.value])
  // watch(entity, () => { console.log(toRaw(entity.value)) })

  const label = computed(() => entity.value?.labels?.[props.language]?.value)
  const description = computed(() => entity.value?.descriptions?.[props.language]?.value)
  const wikipediaLink = computed(() => entity.value && entity.value.sitelinks[`${props.language}wiki`].url)

  onMounted(() => { getEntity(qid.value) })

  async function getEntity(qid:any) {
    if (!qid || entities.value[qid]) return
    let url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`
    const response = await fetch(url)
    const result = await response.json()
    Object.values(result.entities).forEach((entity:any) => {
      entity.summaryText = {}
      if (entity.claims.P18) {
        entity.image = entity.claims.P18[0].mainsnak.datavalue.value
        entity.thumbnail = mwImage(entity.image)
      }
    })
    entities.value = {...entities.value, ...result.entities}
  }

  function mwImage(mwImg:any, width:number=300) {
    // Converts Wikimedia commons image URL to a thumbnail link
    if (Array.isArray(mwImg)) mwImg = mwImg[0]
    mwImg = mwImg.split('/').pop()
    mwImg = decodeURIComponent(mwImg).replace(/ /g,'_')
    const _md5 = Md5.hashStr(mwImg)
    const extension = mwImg.split('.').pop()
    let url = `https://upload.wikimedia.org/wikipedia/commons${width ? '/thumb' : ''}`
    url += `/${_md5.slice(0,1)}/${_md5.slice(0,2)}/${mwImg}`
    if (width) {
      url += `/${width}px-${mwImg}`
      if (extension === 'svg') {
        url += '.png'
      } else if (extension === 'tif' || extension === 'tiff') {
        url += '.jpg'
      }
    }
    return url
  }

</script>

<template>

  <div ref="root" class="hs-tooltip inline-block [--trigger:click] [--placement:top]">
    <a class="hs-tooltip-toggle block text-center" href="javascript:;" title="Click for more information">
      <span v-html="text" class="bg-yellow-100"></span>

      <div class="hs-tooltip-content z-30 hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible hidden opacity-0 transition-opacity absolute invisible max-w-xs bg-white border border-gray-100 text-left rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700" role="tooltip">
        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
          <img class="w-full h-auto rounded-t-xl" :src="entity?.thumbnail" alt="Image Description">
          <div class="p-4 md:p-5">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">
              {{ label }}
            </h3>
            <p class="mt-1 text-gray-800 dark:text-gray-400">
              {{ description }}
            </p>
            <div class="mt-5 text-xs text-gray-500 dark:text-gray-500">
              <a class="inline-flex items-center gap-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm" 
                target="_blank" :href="wikipediaLink">
                <img class="max-w-[24px]" src="https://upload.wikimedia.org/wikipedia/commons/7/77/Wikipedia_svg_logo.svg" />
                <span class="ml-1">Wikipedia</span>
              </a>            
            </div>
          </div>
        </div>
      </div>

    </a>
  </div>

</template>

<style>
  @import '../tailwind.css';
</style>
