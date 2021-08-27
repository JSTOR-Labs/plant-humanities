<template>
  <div id="footer" :style="`max-width:${maxWidth}px; overflow:hidden;`">
    <div class="footer-left">
      <span>a collaboration between</span>
      <img :src="`${assetsBase}/images/do-logo.svg`" style="height:25px;"> &nbsp;&nbsp;
      <img :src="`${assetsBase}/images/labs.jpg`" height="20px">
    </div>

    <div class="footer-right">
      <span>with support from: </span>
      <img :src="`${assetsBase}/images/Mellon.jpg`" height="20px">
    </div>
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
  display: grid;
  grid-gap: 20vw;
  grid-area: unset !important;
  align-items: center;
  font-size: .8rem;
  font-weight: bold;
  padding: 4px 16px;
}

.footer-left {
  grid-column: 1/2;
}

.footer-right {
  grid-column: 2/3;
}

#footer img {
  height: 30px;
  margin: 0 12px;
  vertical-align: middle;
}

@media screen and (max-width: 880px) {
  #footer {
    grid-gap: 40px;
  }
}

@media screen and (max-width: 770px) {
  #footer {
    grid-template-columns: 1fr;
    grid-gap: 8px;
    padding: 4px 8px;
  }

  .footer-left, .footer-right {
    grid-column: auto;
  }
}

</style>
