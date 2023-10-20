<template>

  <section ref="root"
    class="flex sticky top-0 items-center w-full z-10 bg-[#000]/30"
    :style="{height: `${props.height}px`}">
    
    <div v-if="props.logo">
      <a v-if="props.url" :href="props.url">
        <img class="h-[80px] w-[80px]" :src="props.logo" alt="logo"/>
      </a>
      <img v-else :src="props.logo" alt="logo" class="logo"/>
    </div>

    <div class="flex flex-col ml-4">
      <div class="text-4xl text-white font-bold" v-html="props.label"></div>
      <div v-if="props.subtitle" class="text-2xl text-white font-bold" v-html="props.subtitle"></div>
    </div>
    
    <div class="flex items-center gap-4 ml-auto mr-4">
      <ve-site-search v-if="props.searchDomain" :search-domain="props.searchDomain" :search-cx="props.searchCx" :search-key="props.searchKey"></ve-site-search>
      <ve-menu v-if="navEl !== undefined" :auth="auth" :contact="contact" v-html="navEl"></ve-menu>
    </div>

  </section>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, onUpdated, ref, toRaw, watch } from 'vue'

  const props = defineProps({
    label: { type: String },
    subtitle: { type: String },
    background: { type: String},
    logo: { type: String },
    url: { type: String },
    auth: { type: String }, // "github" or "netlify"
    alpha: { type: Number },
    contact: { type: String },
    sticky: { type: Boolean, default: false },
    height: { type: Number, default: 80 },
    offset: { type: Number, default: 0 },
    searchDomain: { type: String },
    searchCx: { type: String },
    searchKey: { type: String }
  })

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const shadow = computed(() => root?.value?.parentNode?.querySelector('section') as HTMLElement)
  watch(shadow, () => applyProps() )

  const navEl = ref<string>()
  // watch(navEl, () => console.log(toRaw(navEl.value)) )

  onMounted(() => {
    nextTick(() => {
      console.log((window as any).config?.nav)
      let ul = (host.value.querySelector('ul') as HTMLUListElement)
      if (!ul && (window as any).config?.nav) {
        ul = document.createElement('ul');
        (window as any).config?.nav.forEach((item:any) => {
          const li = document.createElement('li')
          const a = document.createElement('a')
          a.href = item.href
          a.innerHTML = `${item.icon}${item.label}`
          li.appendChild(a)
          ul.appendChild(li)
        })
      }
      navEl.value = ul.innerHTML
    })
  })

  watch(props, () => applyProps())

  function applyProps() {
    shadow.value.style.height = `${props.height}px`
    // if (props.background) host.value.style.backgroundColor = props.background
    if (props.offset) shadow.value.style.marginTop = `-${props.offset}px`
    if (props.sticky) {
      host.value.classList.add('sticky')
      host.value.style.position = 'sticky'
      // host.value.style.top = '0'
      // if (props.alpha) host.value.style.background = `rgba(0, 0, 0, ${props.alpha})`
      // host.value.style.background = '#444A1E'
      host.value.style.opacity = '100'
      host.value.style.marginTop = `-${props.offset}px`
    }
    if (props.label) {
      let titleEl = document.querySelector('title')
      if (!titleEl) {
        titleEl = document.createElement('title')
        document.head.appendChild(titleEl)
      }
      titleEl.innerText = props.label
    }
  }

</script>

<style>
  @import '../tailwind.css';
</style>