<template>
  <content-pane>
    <v-row align="center">
      <v-col>
        <h1>Tot ziens</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-1 pt-0">
        <span>
          Tot de volgende keer bij Netmobiel, dé mobiliteitsapp van de
          Achterhoek en omstreken.
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-1 pt-0">
        <span>
          U wordt nu afgemeld...
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-1 pt-0">
        <v-progress-circular indeterminate class="rotate"></v-progress-circular>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'

export default {
  components: {
    ContentPane,
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss"></style>
