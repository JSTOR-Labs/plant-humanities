<template>
  <v-container :style="outerContainerStyle">
    <v-card flat>
      <v-tabs
        v-model="tab"
        background-color="primary"
        dark
      >
        <v-tab
          v-for="specimens in specimensByTaxon"
          :key="specimens.id"
        >
          {{ specimens.taxonName }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(specimens, seq) in specimensByTaxon"
          :key="specimens.id"
        >
          <v-card flat>
            <v-card-text flat :style="innerContainerStyle">
              <image-viewer
                :seq="seq+1"
                :items="specimens.specimens"
                :width="width"
                :height="height - 46"
                initial-mode="iiif"
                default-fit="cover">
              </image-viewer>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
  module.exports = {
    name: 'PlantSpecimenViewer',
    props: { items: Array, width: Number, height: Number },
    data: () => ({
      tab: undefined,
      specimensByTaxon: []
    }),
    computed: {
      outerContainerStyle() { return { width: `${this.width}px`, height: `${this.height}px`, padding: 0 } },
      innerContainerStyle() { return { height: `${this.height - 48}px`, padding: 0, overflowY: 'auto !important' } },
    },
    mounted() {
      console.log('PlantSpecimenViewer')
      this.items.forEach(item => this.getSpecimenMetadata(item))
    },
    methods: {
      getSpecimenMetadata(item) {
        if (item.label) {
          const args = Object.keys(item).filter(arg => ['max', 'reverse'].includes(arg)).map(arg => `${arg}=${item[arg]}`)
          fetch(`https://plant-humanities.app/specimens/${item.label.replace(/ /, '_')}` + (args ?  `?${args.join('&')}` : ''))
            .then(resp => resp.json())
            .then(specimensMetadata => {
              if (specimensMetadata.specimens.length > 0) {
                specimensMetadata.caption = item.label
                specimensMetadata.specimens.forEach(specimen => {
                  const defaultImage = specimen.images.find(img => img.type === 'default')
                  specimen.url = defaultImage.url
                  specimen.title = specimen.description
                })
                this.specimensByTaxon = [...this.specimensByTaxon, specimensMetadata]
                this.$store.dispatch('updateItem', { ...item, ...{ specimensMetadata }})
              }
            })
        }
      }
    }
  }
</script>
