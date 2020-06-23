<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Reis Details</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        {{ trip }}
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
export default {
  name: 'TripUpdatePageVue',
  components: { ContentPane },
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
    console.log('router params: ', this.tripId, this.$route.query.shoutOut)
    this.isShoutOut = this.$route.query.shoutOut
  },
}
</script>

<style scoped></style>
