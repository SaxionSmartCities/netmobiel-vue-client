<template>
  <content-pane>
    <v-row class="ma-auto mt-2">
      <v-col>
        <h1>Je oproep is verstuurd! 🎉</h1>
      </v-col>
    </v-row>
    <v-row class="ma-auto mt-2">
      <v-col>
        Hier een korte uitleg over de shoutout
      </v-col>
    </v-row>
    <v-row class="ma-auto mt-2">
      <v-col>
        <v-btn block rounded depressed class="my-3 button" to="/shoutouts">
          Bekijk je oproepen
        </v-btn>
        <v-btn
          block
          rounded
          depressed
          outlined
          color="primary"
          to="/modeSelection"
        >
          Plan een nieuwe reis
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'

export default {
  name: 'ShoutoutSubmittedPage',
  components: { ContentPane },
  data() {
    return {}
  },
}
</script>

<style lang="scss"></style>
