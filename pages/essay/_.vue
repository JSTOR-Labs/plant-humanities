<template>
  <v-layout>
    <v-flex>
      <div :ref="$options.name" v-html="essay"/>
    </v-flex>
  </v-layout>
</template>

<script>
import Mixin from '../mixin'

export default {
  validate ({ params }) {
    return true
  },
  name: 'essay',
  mixins: [ Mixin ],
  created() {
    console.log('essay.created')
    this.$store.dispatch('setBanner', undefined)
  },
  mounted() {
    window.scrollTo(0, 0)
    if (this.settingsLoaded) {
      this.getEssay(`${this.baseUrl}/content/${this.$route.params.pathMatch}.md`)
    }
  },
  watch: {
    settingsLoaded() {
      this.getEssay(`${this.baseUrl}/content/${this.$route.params.pathMatch}.md`)
    }
  }
}
</script>
