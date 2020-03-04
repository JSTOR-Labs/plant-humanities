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
  mounted() {
    console.log('essay', this.$route)
    window.scrollTo(0, 0)
    if (this.pages) {
      this.getEssay(`${this.baseUrl}/${this.$route.params.pathMatch}.md`)
    }
  },
  watch: {
    pages() {
      this.getEssay(`${this.baseUrl}/${this.$route.params.pathMatch}.md`)
    }
  }
}
</script>
