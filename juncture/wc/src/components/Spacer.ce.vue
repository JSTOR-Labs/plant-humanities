<template>

  <div :style="{height:props.height}"></div>

</template>
  
<script setup lang="ts">

  const props = defineProps({
    height: { type: String, default: '50vh' }
  })

</script>
