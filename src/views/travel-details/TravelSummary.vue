<template>
  <v-layout>
    <v-flex id="details">
      <v-layout column>
        <v-flex id="datumRow">
          <v-layout py-2>
            <v-flex xs4>Datum</v-flex>
            <v-flex>{{ printableDate }}</v-flex>
          </v-layout>
        </v-flex>
        <v-flex id="reisduurRow">
          <v-layout py-2>
            <v-flex xs4>Reisduur</v-flex>
            <v-flex>{{ Math.round(duration / 60) }} minuten</v-flex>
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
import moment from 'moment'

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
  computed: {
    printableDate: function() {
      console.log(this.date)
      let result = moment(this.date)
        .locale('nl')
        .format('LLLL')

      return result.substring(0, result.lastIndexOf(' ') - 5)
    },
  },
}
</script>

<style lang="scss"></style>
