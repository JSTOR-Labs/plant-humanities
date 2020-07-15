<template>
  <v-container id="footer" ref="footer" v-mutate.attr="onMutate" style="z-index:100 !important;">
    <v-row>
      <v-col cols="6" nogutter>
        <span style="padding-bottom: 8px; font-weight: bold; font-size: 14px;">A collaboration between:</span>
        <img src="https://jstor-labs.github.io/plant-humanities/images/do-logo.svg" style="height:100px; margin:-40px 0;"> &nbsp;&nbsp;&nbsp;&nbsp;
        <img src="https://jstor-labs.github.io/plant-humanities/images/labs.jpg" height="20px">
      </v-col>
      <v-col cols="6">
        <span style="padding-bottom: 8px; font-weight: bold; font-size: 14px;">Funded by:</span>
        <img src="https://jstor-labs.github.io/plant-humanities/images/Mellon.jpg" height="20px">
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  module.exports = {  
    data: () => ({
      height: undefined
    }),
    mounted() {
      this.height = this.$refs.footer.clientHeight
      this.$emit('footer-height', this.height)
    },
    methods: {
      onMutate(mutations) {
        const mutation = mutations[mutations.length - 1]
        if (mutation.target && mutation.target.clientHeight !== this.height) {
          this.height = mutation.target.clientHeight
          this.$emit('footer-height', this.height)
        }
      }
    }
  }
</script>

<style>
  
  [v-cloak] { display: none; }
  #footer {
    border: 1px solid #ddd;
    margin: 0;
    max-width: none;
  } 
  .site-footer, .row {
    padding: 0;
    margin: 0;
  }
  .col {
    padding: 0 16px;
  }

</style>