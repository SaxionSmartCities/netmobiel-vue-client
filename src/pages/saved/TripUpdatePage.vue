<template>
  <content-pane>
    <v-row>
      <v-col>
        <h4>Reis Details</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        <search-criteria
          :planning-request="trip"
          :enable-edit="true"
          @change="onChangeProperty"
        ></search-criteria>
        <v-btn @click="toSearch()">To Search</v-btn>
        <v-btn @click="timeFormatTest()">test time format</v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import SearchCriteria from '@/components/common/SearchCriteria'
import { TIMESTAMP_FORMAT } from '@/utils/datetime'
import moment from 'moment'
export default {
  name: 'TripUpdatePageVue',
  components: { SearchCriteria, ContentPane },
  props: {
    tripId: { type: Number, required: true },
  },
  data() {
    return {
      isShoutOut: null,
    }
  },
  computed: {
    trip() {
      if (this.isShoutOut !== null) {
        if (!this.isShoutOut) {
          return this.$store.getters['is/getPlannedTrips'].find(
            trip => trip.id === this.tripId
          )
        } else {
          return this.$store.getters['is/getShoutOuts'].find(
            trip => trip.id === this.tripId
          )
        }
      }
      return {}
    },
  },
  mounted() {
    this.isShoutOut = this.$route.query.shoutOut
  },
  methods: {
    onChangeProperty(value) {
      console.log('onChangeProperty', value, this.trip)
    },
    timeFormatTest() {
      console.log('Time:', this.trip.arrivalTime)
      console.log(
        'Time Formatted:',
        moment(moment(this.trip.arrivalTime), TIMESTAMP_FORMAT)
      )
    },
    toSearch() {
      const isArrival = !!this.trip.arrivalTime
      const result = {
        from: {
          title: this.trip.from.label,
          position: [this.trip.from.latitude, this.trip.from.longitude],
        },
        to: {
          title: this.trip.to.label,
          position: [this.trip.to.latitude, this.trip.to.longitude],
        },
      }
      const journeyMoment = {
        when: isArrival
          ? // The dates must be wrapped in a moment() object, else some values will be misinterpreted by Moment
            moment(moment(this.trip.arrivalTime), TIMESTAMP_FORMAT)
          : moment(moment(this.trip.departureTime), TIMESTAMP_FORMAT),
        arriving: isArrival,
      }
      this.$store.commit('gs/setGeoLocationsPicked', result)
      this.$store.commit('gs/setPreFilledTime', journeyMoment)

      const { searchPreferences } = this.$store.getters['ps/getProfile']
      this.$store.dispatch('is/submitPlanningsRequest', {
        from: result.from,
        to: result.to,
        searchPreferences,
        timestamp: journeyMoment,
      })
      this.$store.commit('is/clearPlanningPlan')

      this.$router.push({ name: 'searchResults', params: { editTrip: true } })
    },
  },
}
</script>

<style scoped></style>
