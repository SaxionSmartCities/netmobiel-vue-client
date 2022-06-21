<template>
  <content-pane>
    <v-row align="center">
      <v-col>
        <h1>Pagina niet gevonden</h1>
      </v-col>
    </v-row>
    <v-row class="text-body-1">
      <v-col>
        <span> De gevraagde pagina ({{ $route.path }}) is onbekend. </span>
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
  created() {
    uiStore.mutations.showBackButton()
  },
}
</script>

<style scoped lang="scss"></style>
