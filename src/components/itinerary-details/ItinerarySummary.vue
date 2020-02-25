<template>
  <v-layout class="py-0">
    <v-flex>
      <v-layout column>
        <v-flex>
          <v-layout py-2>
            <v-flex xs3>Datum</v-flex>
            <v-flex>{{ printableDate }}</v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout py-2>
            <v-flex xs3>Reisduur</v-flex>
            <v-flex>{{ Math.round(duration / 60) }} minuten</v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <!-- <v-layout py-2>
            <v-flex xs3>Kosten</v-flex>
            <v-flex>{{ cost }} credits</v-flex>
          </v-layout> -->
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ItinerarySummary',
  components: {},
  props: {
    date: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
  },
  data: function() {
    return {}
  },
  computed: {
    printableDate: function() {
      let result = moment(this.date)
        .locale('nl')
        .format('LLLL')

      return result.substring(0, result.lastIndexOf(' ') - 5) // Ugh.. (-5 because of - " 2019")
    },
  },
}
</script>

<style lang="scss"></style>
