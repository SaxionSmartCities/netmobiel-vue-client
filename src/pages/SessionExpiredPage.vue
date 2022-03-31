<template>
  <content-pane>
    <v-row align="center">
      <v-col>
        <h1>Sessie ongeldig</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span> De sessie is niet meer geldig. Meld je opnieuw aan. </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="shrink">
        <v-progress-circular indeterminate color="button"></v-progress-circular>
      </v-col>
      <v-col class="align-center">
        <span> Je wordt binnen enkele seconden doorgestuurd... </span>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'

const DELAY_KEYCLOAK_LOGIN = 2000

export default {
  components: {
    ContentPane,
  },
  data() {
    return {}
  },
  mounted() {
    this.gotoKeycloakLogin()
  },
  methods: {
    gotoKeycloakLogin() {
      setTimeout(() => {
        const options = {
          redirectUri: window.location.origin,
        }
        this.$keycloak.loginFn(options)
      }, DELAY_KEYCLOAK_LOGIN)
    },
  },
}
</script>

<style scoped lang="scss"></style>
