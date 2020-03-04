<template>
  <v-layout>
    <v-flex>
      <div :ref="$options.name" v-html="html"/>
    </v-flex>
  </v-layout>
</template>

<script>
import Mixin from './mixin'

  export default {
    name: 'all',
    mixins: [ Mixin ],
    mounted() {
      console.log(this.$route)
      const page = this.$store.getters.pages.find(page => page.path === this.$route.path)
      console.log('page', page)
      this.getStaticPage(page)
    }
  }
</script>
