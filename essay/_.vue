<template>
  <v-layout>
    <v-flex>
      <div :ref="$options.name" v-html="html"/>
    </v-flex>
  </v-layout>
</template>

<script>
import Mixin from '../mixin'

export default {
  // validate ({ params }) { return true },
  name: 'essay',
  mixins: [ Mixin ],
  mounted() {
    this.$store.dispatch('setBanner', undefined)
    this.getEssay(this.$route)
  }
}
</script>
