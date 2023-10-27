<template>

  <div ref="root" >
    <sl-icon id="tippy" name="info-circle-fill"></sl-icon>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, ref, watch } from 'vue'
  import tippy from 'tippy.js'

  import '@shoelace-style/shoelace/dist/components/icon/icon.js'

  const props = defineProps({
    manifest: { type: String }
  })

  const root = ref<HTMLElement | null>(null)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)


  watch(host, () => { 
    tippy(host.value, {
      theme: 'light-border',
      allowHTML: true,
      interactive: true,
      appendTo: document.body,
      placement: 'bottom-end',
      arrow: true,
      delay: [null, null],
      // content: `<ve-entity-card qid="Q5582"></ve-entity-card>`
      // content: '<div style="background-color:white;padding:12px;">Hello</div>',
      // content: `<ve-manifest manifest="${manifest.value.id}"></ve-manifest>`
      onShow: (instance:any) => instance.setContent(`<div class="manifest-popup"><ve-manifest manifest="${props.manifest}"></ve-manifest></div>`)
    })
  })

</script>

<style>

  #tippy {
      width: 24px;
      height: 24px;
      font-size: 20px;
      border: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      background-color: white;
      display: flex;
      justify-content: center;
    }

</style>