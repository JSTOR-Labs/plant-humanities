<template>
  <div>
    <v-dialog v-model="isOpen" @click:outside="close" max-width="80%">
      <v-card class="markdown-viewer">
        <v-card-title>
          Markdown source
        </v-card-title>
        <div :style="`height:${viewport.height*.75}px;overflow-y:scroll;`">
          <pre v-highlightjs="markdown"><code class="markdown"></code></pre>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>      
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'markdown-viewer',
  data: () => ({
    isOpen: false,
    markdown: undefined
  }),
  computed: {
    viewport ()  { return this.$store.getters.viewport },
    showMarkdown () { return this.$store.getters.showMarkdown },
    markdownSource () { return this.$store.getters.markdownSource },
  },
  methods: {
    close() {
      this.$store.dispatch('setShowMarkdown', false)
    }
  },
  watch: {
    showMarkdown(show) {
      this.isOpen = show
    },
    isOpen() {
      if (this.isOpen) {
        axios.get(this.markdownSource).then(resp => this.markdown = resp.data)
      }
    }
  }
}
</script>

<style>

  .v-application code {
    color: #000;
    font-weight: normal;
  }

  .xml {
    background-color: rgba(255, 255, 102, 0.3);
    color: #000;
  }
</style>
