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
    name: 'static-page',
    mixins: [ Mixin ],
    mounted() {
      this.getStaticPage(this.$route)
    }
  }
</script>
