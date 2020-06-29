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
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import SearchCriteria from '@/components/common/SearchCriteria'
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
      console.log('onChangeProperty', value)
    },
    toSearch() {
      this.$store.commit('is/setInitSearchRequest', {
        to: this.trip.to,
        from: this.trip.from,
        trip: this.trip,
      })
      console.log('12')
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
      this.$store.commit('gs/setGeoLocationsPicked', result)
      this.$router.push({ name: 'searchRide', params: { new: false } })
    },
  },
}
</script>

<style scoped></style>
