<template>
  <content-pane>
    <v-row align="center">
      <v-col>
        <h1>Tot ziens</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span>
          Tot de volgende keer bij Netmobiel, dé mobiliteitsapp van de
          Achterhoek en omstreken.
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="shrink">
        <v-progress-circular indeterminate class="rotate"></v-progress-circular>
      </v-col>
      <v-col class="align-center">
        <span>
          U wordt nu afgemeld...
        </span>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import * as uiStore from '@/store/ui'

export default {
  components: {
    ContentPane,
  },
  data() {
    return {}
  },
  beforeCreate() {
    uiStore.mutations.disableFooter()
  },
}
</script>

<style lang="scss"></style>
