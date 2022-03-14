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
        <span> Je wordt nu afgemeld... </span>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

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
  mounted() {
    psStore.mutations.deleteAccessToken()
    this.$keycloak.logoutFn()
    // Show our logout page, the redirect from keycloak will navigate to the landing page
  },
}
</script>

<style lang="scss"></style>
