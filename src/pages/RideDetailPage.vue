<template>
  <v-container>
    <v-layout column>
      <v-flex mb-3>
        <h3>Reisdetails</h3>
      </v-flex>
      <v-flex>
        <v-divider />
      </v-flex>
      <v-flex my-2>
        <itinerary-summary
          :date="selectedTrip.date"
          :cost="5"
          :duration="30000"
        />
      </v-flex>
      <v-flex>
        <v-divider />
      </v-flex>
      <v-flex>
        <v-layout mt-4 column>
          <v-flex v-for="(leg, index) in generateSteps" :key="index">
            <itinerary-leg :leg="leg" />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex mt-4>
        <v-alert type="info" value="true" color="blue">
          Op deze pagina zullen de reisdetails van de rit met
          {{ printableDriverName }} getoond worden. De tijdsaanduiding van de
          reis werkt op dit moment nog niet.
        </v-alert>
      </v-flex>
      <v-flex my-4>
        <v-btn large round block mb-4 @click="notifyDriver">
          Laat {{ printableDriverName }} weten dat je meerijdt!
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ItinerarySummary from '@/components/itinerary-details/ItinerarySummary.vue'

export default {
  name: 'RideDetailPage',
  components: { ItinerarySummary, ItineraryLeg },
  computed: {
    selectedTrip: function() {
      console.log(this.$store.getters['is/getSelectedTrip'])
      return this.$store.getters['is/getSelectedTrip']
    },
    generateSteps: function() {
      let results = []
      results.push({
        agencyId: 'NetMobiel',
        agencyName: this.selectedTrip.ride.driver.givenName,
        agencyTimeZoneOffset: 7200000,
        arrivalDelay: 0,
        departureDelay: 0,
        distance: 957.3050000000002,
        duration: 5000,
        endTime: 1571316359000,
        flexDrtAdvanceBookMin: 0,
        from: {
          departure: 1571315559000,
          lat: this.selectedTrip.from.lat,
          lon: this.selectedTrip.from.lon,
          name: this.selectedTrip.ride.fromPlace.label,
          orig: this.selectedTrip.from.orig,
          vertexType: 'NORMAL',
        },
        interlineWithPreviousLeg: false,
        legGeometry: {},
        mode: 'CAR',
        route: '',
        startTime: 1571315559000,
        steps: [],
        to: {
          arrival: 1571316359000,
          boardAlightType: 'DEFAULT',
          departure: 1571316360000,
          lat: this.selectedTrip.to.lat,
          lon: this.selectedTrip.to.lon,
          name: this.selectedTrip.ride.toPlace.label,
        },
      })

      results.push({
        mode: 'FINISH',
        startTime: 1571315559000,
        to: {
          arrival: 1571316359000,
          lat: 52.2222985943,
          lon: 6.88958108425,
          name: this.selectedTrip.ride.toPlace.label,
          orig: '',
          vertexType: 'NORMAL',
        },
      })
      return results
    },
    printableDate: function() {
      console.log(this.selectedTrip)
      return moment(this.selectedTrip.date).format('DD-MM-YYYY')
    },
    printableDriverName: function() {
      if (this.selectedTrip.ride.driver === undefined) {
        return 'Voornaam'
      } else {
        return this.selectedTrip.ride.driver.givenName
      }
    },
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },

  methods: {
    notifyDriver: function() {
      // eslint-disable-next-line
      console.log('Notify driver ', this.selectedTrip.ride.driverRef)
      // WORK SOME MAGIC HERE. TSE01: TADAA
      this.$store.dispatch('pn/sendNotification', {
        recipientId: this.selectedTrip.ride.driverRef,
        messageType: '001',
      })
    },
  },
}
</script>

<style lang="scss"></style>
