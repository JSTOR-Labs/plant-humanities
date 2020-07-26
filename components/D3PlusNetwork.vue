<template>
  <v-container :style="containerStyle">
    <div id="datavis"/>
  </v-container>
</template>

<script>

// Uses https://d3plus.org/

module.exports = {
    name: 'D3PlusNetwork',
    props: {
      items: Array,
      width: Number,
      height: Number
    },
    computed: {
      containerStyle() { return { width: `${this.width}px`, height: `${this.height}px`, overflowY: 'auto !important', marginLeft: '24px' } },
    },
    mounted() {
      fetch(this.items[0].url).then(resp => resp.json())
      .then(data => {

        // A couple of simple data transforms to reformat Ashley's json data
        //   Move the name into the id attribute
        //   Convert link references to use zero based indexing
        data.nodes.forEach(node => { node.id = node.name })
        data.links.forEach(link => { link.source = link.source -= 1; link.target = link.target -= 1 })

        new d3plus.Network()
          .select('#datavis')
          .links(data.links)
          .nodes(data.nodes)
          .render()
      })
    }
  }
</script>

<style scoped>
  body {
    margin: 0;
    overflow: hidden;
  }
</style>