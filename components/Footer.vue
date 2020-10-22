<template>
  <div id="footer">
    A collaboration between <img src="https://jstor-labs.github.io/plant-humanities/images/do-logo.svg" style="height:100px;"> &nbsp;&nbsp;&nbsp;&nbsp;
    
    <img src="https://jstor-labs.github.io/plant-humanities/images/labs.jpg" height="20px">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    Funded by: <img src="https://jstor-labs.github.io/plant-humanities/images/Mellon.jpg" height="20px">
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
    font-size: .8rem;
    font-weight: bold;
    padding-left: 20px;
  } 
  #footer img {
    height: 30px;
    margin: 0 12px;
  }

</style>
