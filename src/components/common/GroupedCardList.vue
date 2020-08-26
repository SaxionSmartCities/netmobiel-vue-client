<template>
  <v-row v-if="items">
    <v-col>
      <section
        v-for="date in getAllDifferentDays(sortedTrips())"
        :key="date"
        class="px-0"
      >
        <h4 class="netmobiel py-1">{{ formatToCategoryDate(date) }}</h4>
        <v-col
          v-for="(trip, index) in getItinerariesForThatDay(sortedTrips(), date)"
          :key="index"
          class="pa-0"
        >
          <slot name="card" :trip="trip" :index="index"> </slot>
        </v-col>
        <v-col class="py-1">
          <!-- Trailing col for bottom spacing group -->
        </v-col>
      </section>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'

export default {
  name: 'GroupedCardList',
  props: {
    items: { type: Array, required: true },
  },
  methods: {
    sortedTrips() {
      const list = Object.assign([], this.items)
      return list
    },
    getAllDifferentDays(trips) {
      let differentDays = []
      trips.forEach(trip => {
        const calendarDate = moment(trip.itinerary.arrivalTime).format('LL')
        if (!differentDays.includes(calendarDate)) {
          differentDays.push(calendarDate)
        }
      })
      return differentDays
    },
    getItinerariesForThatDay(trips, sectionDay) {
      return trips.filter(trip => {
        const dateToCheck = moment(trip.itinerary.arrivalTime.valueOf())
        return (
          moment(sectionDay, 'LL').isSame(dateToCheck, 'day') &&
          moment(sectionDay, 'LL').isSame(dateToCheck, 'month')
        )
      })
    },
    formatToCategoryDate(date) {
      return moment(date, 'LL')
        .locale('NL')
        .format('dddd DD MMMM')
    },
  },
}
</script>

<style scoped></style>
