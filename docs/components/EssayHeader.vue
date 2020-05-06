<template>
  <v-toolbar-title v-cloak style="min-height: 104px;">
    <v-container class="summary">
      <v-row style="height:100%;" no-gutters>

        <v-col cols="12" sm="9">
          <h3>{{title}}</h3>
          <p id="author-name">{{author}}</p>
        </v-col>

        <v-col class="align-end" cols="12" sm="3" style="text-align: right">
          <b>This visual essay contains:</b> <br/>
          {{numLocations}} interactive maps &nbsp;&nbsp;<i class="fal fa-map-marker-alt"></i> <br/>
          {{numImages}} images &nbsp;&nbsp;<i class="fal fa-map-marked-alt"></i> <br/>
          {{numSpecimens}} plant specimens &nbsp;&nbsp;<i class="fal fa-file-image"></i> <br/>
          {{numPrimarySources}} primary source materials &nbsp;&nbsp;<i class="fal fa-book-alt"></i>
        </v-col>

      </v-row>
      <v-row><v-progress-linear v-model="progress" id="prog" height="7"></v-progress-linear></v-row>
    </v-container>
  </v-toolbar-title>
</template>

<script>
  module.exports = {
    props: {
      essayConfig: Object,
      progress: Number
    },    
    data: () => ({}),
    computed: {
      title() { return this.essayConfig.title || '' },
      author() { return this.essayConfig['author'] || '' },
      numLocations() { return this.essayConfig['num-locations'] || 0 },
      numImages() { return this.essayConfig['num-images'] || 0 },
      numSpecimens() { this.essayConfig['num-specimens'] || 0 },
      numPrimarySources() { return this.essayConfig['num-primary-sources'] || 0 }
    }
  }
</script>

<style>
  [v-cloak] { display: none; }
</style>