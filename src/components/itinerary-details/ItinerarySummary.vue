<template>
  <v-row class="py-0">
    <v-col class="">
      <v-row class="flex-column">
        <v-col class="py-0">
          <v-row class="mb-3">
            <v-col cols="3" class="pa-0">
              <span class="body-1">Datum</span>
            </v-col>
            <v-col class="pa-0">
              <span class="body-1 font-weight-light">
                {{ printableDate }}
              </span>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="py-0">
          <v-row>
            <v-col cols="3" class="pa-0 body-1">Reisduur</v-col>
            <v-col class="pa-0">
              <span class="body-1 font-weight-light">
                {{ Math.round(duration / 60) }} minuten
              </span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
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
