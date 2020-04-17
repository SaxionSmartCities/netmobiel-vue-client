<template>
  <v-row no-gutters>
    <v-col>
      <v-row>
        <v-col cols="3" xs3>Datum:</v-col>
        <v-col>{{ printableDate }}</v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="3" xs3>Reisduur:</v-col>
        <v-col>{{ Math.round(duration / 60) }} minuten</v-col>
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
  data() {
    return {}
  },
  computed: {
    printableDate() {
      return moment(this.date)
        .locale('nl')
        .format('dddd DD MMMM')
    },
  },
}
</script>

<style lang="scss"></style>
