<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col>
        <h1>Profiel ingevuld 🎉</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col> Bedankt voor het aanvullen van je profiel! </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block rounded depressed class="my-3 button" to="/modeSelection">
          Plan een rit
        </v-btn>
        <v-btn block rounded depressed outlined to="/profile">
          Bekijk profiel
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'OnboardingCompletedPage',
}
</script>

<style lang="scss"></style>
