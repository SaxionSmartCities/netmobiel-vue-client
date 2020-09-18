<template>
  <v-row v-if="items">
    <v-col v-if="type === 'trip'" class="py-0">
      <section
        v-for="date in getAllDifferentDays(sortedTrips())"
        :key="date"
        class="px-0"
      >
        <h4 class="netmobiel pb-1">{{ formatToCategoryDate(date) }}</h4>
        <v-col
          v-for="(item, index) in getItinerariesForThatDay(sortedTrips(), date)"
          :key="index"
          class="pa-0"
        >
          <slot name="card" :item="item" :index="index"> </slot>
        </v-col>
        <v-col class="py-1">
          <!-- Trailing col for bottom spacing group -->
        </v-col>
      </section>
    </v-col>
    <v-col v-else-if="type === 'ride'" class="py-0">
      <section
        v-for="date in getAllDifferentDaysForRides(sortedRides())"
        :key="date"
        class="px-0"
      >
        <h4 class="netmobiel pb-1">{{ formatToCategoryDate(date) }}</h4>
        <v-col
          v-for="(item, index) in getRidesByDay(sortedRides(), date)"
          :key="index"
          class="pa-0"
        >
          <slot name="card" :item="item" :index="index"> </slot>
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
    type: { type: String, required: false, default: 'trip' },
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
    sortedRides() {
      const list = Object.assign([], this.items)
      return list
    },
    getAllDifferentDaysForRides(rides) {
      let differentDays = []
      rides.forEach(ride => {
        const calendarDate = moment(ride.departureTime).format('LL')
        if (!differentDays.includes(calendarDate)) {
          differentDays.push(calendarDate)
        }
      })
      return differentDays
    },
    getRidesByDay(rides, sectionDay) {
      return rides.filter(ride => {
        const dateToCheck = moment(ride.departureTime.valueOf())
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
