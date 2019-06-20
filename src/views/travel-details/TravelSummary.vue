<template>
  <v-layout>
    <v-flex id="details">
      <v-layout column>
        <v-flex id="datumRow">
          <v-layout py-2>
            <v-flex xs4>Datum</v-flex>
            <v-flex>{{ date }}</v-flex>
          </v-layout>
        </v-flex>
        <v-flex id="reisduurRow">
          <v-layout py-2>
            <v-flex xs4>Reisduur</v-flex>
            <v-flex>{{ duration }} minuten</v-flex>
          </v-layout>
        </v-flex>
        <v-flex id="kostenRow">
          <v-layout py-2>
            <v-flex xs4>Kosten</v-flex>
            <v-flex>{{ cost }} credits</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'TravelSummary',
  components: {},
  props: {
    date: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
  },
  data: function() {
    return {}
  },
}
</script>

<style lang="scss"></style>
