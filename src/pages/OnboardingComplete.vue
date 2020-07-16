<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col>
        <h1>Profiel ingevuld 🎉</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Bedankt voor het invullen van je profiel! Je krijgt een gratis rit zo
        snel mogelijk toeschreven op je account.
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block rounded depressed class="my-3 button" to="/modeSelection">
          Plan een reis
        </v-btn>
        <v-btn block rounded depressed outlined to="/profile">
          Bekijk profiel
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import constants from '@/constants/update-messages.js'
import { mutations } from '@/store/ui/mutations.ts'

export default {
  name: 'OnboardingComplete',
  data() {
    return {}
  },
  mounted() {
    let update = constants.COMPLETE_PROFILE_UPDATE
    this.$store.commit('ui/removeUpdate', update)
  },
}
</script>

<style lang="scss"></style>
