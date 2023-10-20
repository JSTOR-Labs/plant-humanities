<script setup lang="ts">

  import { computed, onMounted, ref, watch } from 'vue'

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)
  const text = computed(() => host.value?.textContent)
  const action = ref()

  const props = defineProps({
    anno: { type: String },
    play: { type: String },
    start: { type: String },
    zoomto: { type: String },
  })

  watch(props, () => { getAction() })
  onMounted(() => { getAction() })

  function getAction() {
    action.value = props.anno && 'anno' || props.play && 'play' || props.start && 'play' || props.zoomto && 'zoomto'
  }

</script>

<template>
  <a ref="root" class="bg-green-100" href="javascript:;" v-html="text" :title="`Click to trigger ${action} action`"></a>
</template>

<style>
  @import '../tailwind.css';
</style>