<template>
  <div id="footer">
    <img src="https://jstor-labs.github.io/plant-humanities/images/do-logo.svg" style="height:100px; margin:-40px 0;"> &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://jstor-labs.github.io/plant-humanities/images/labs.jpg" height="20px">
    <img src="https://jstor-labs.github.io/plant-humanities/images/Mellon.jpg" height="20px">
  </div>
</template>

<script>

  module.exports = {  
    name: 'Footer',
    props: {},
    data: () => ({}),
    computed: {},
    mounted() {},
    methods: {},
    watch: {}
  }

</script>

<style>
  
  [v-cloak] { display: none; }

  #footer {
    display: flex;
    align-items: center;
    height: 50px;
  } 
  #footer img {
    height: 30px;
    margin: 0 12px;
  }

</style>
