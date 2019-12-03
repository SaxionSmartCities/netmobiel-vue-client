<template>
  <v-container>
    <v-layout column justify-center fill-height>
      <v-flex shrink mb-4>
        <h1>Profiel ingevuld 🎉</h1>
      </v-flex>
      <v-flex shrink>
        Bedankt voor het invullen van je profiel! Je krijgt een gratis rit zo
        snel mogelijk toeschreven op je account.
      </v-flex>
      <v-flex shrink>
        <v-btn block rounded depressed class="my-3 button" to="/modeSelection">
          Plan een reis</v-btn
        >
        <v-btn
          block
          disabled
          rounded
          depressed
          outlined
          color="green"
          to="/profile"
        >
          Bekijk profiel
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import constants from '@/constants/update-messages.js'

export default {
  name: 'OnboardingComplete',
  data: function() {
    return {}
  },
  mounted() {
    let update = constants.COMPLETE_PROFILE_UPDATE
    this.$store.commit('ui/removeUpdate', update)
  },
}
</script>

<style lang="scss"></style>
