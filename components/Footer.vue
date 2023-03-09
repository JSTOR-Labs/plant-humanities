<template>
  <div id="footer" :style="`max-width:${maxWidth}px; overflow:hidden;`">
    a collaboration between <img :src="`${assetsBase}/images/do-logo.svg`" style="height:100px;"> &nbsp;&nbsp;
    <img :src="`${assetsBase}/images/labs.jpg`" height="20px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    with support from: <img :src="`${assetsBase}/images/Mellon_Logomark_Lockup_Black.png`" height="20px">
  </div>
</template>

<script>

  module.exports = {  
    name: 'Footer',
    props: {
      siteConfig: { type: Object, default: function(){ return {}} },
      contentSource:  { type: Object, default: () => ({}) }
    },
    data: () => ({}),
    computed: {
      maxWidth() { return window.innerWidth },
      assetsBase() { return this.contentSource.assetsBaseUrl }
    },
    mounted() {},
    methods: {},
    watch: {}
  }

</script>

<style>
  
  [v-cloak] { display: none; }

  #footer {
    font-family: Roboto, sans-serif;
    display: flex;
    align-items: center;
    height: 50px;
    font-size: .8rem;
    font-weight: bold;
    padding-left: 20px;
  } 
  #footer img {
    height: 30px;
    margin: 0 12px;
  }

</style>
