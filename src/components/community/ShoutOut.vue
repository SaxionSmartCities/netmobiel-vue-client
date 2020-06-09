<template>
  <v-card
    outlined
    class="shoutout-container"
    @click="$emit('shoutoutSelected', shoutout.id)"
  >
    <v-row class="mb-2">
      <v-col class="shrink">
        <v-img class="shoutout-image" :src="profileImage" />
      </v-col>
      <v-col>
        <p class="font-weight-regular header mb-0">Reiziger</p>
        <p class="font-weight-light subtitle-1 mb-0">
          {{
            isMine ? shoutout.traveller.firstName : shoutout.traveller.givenName
          }}
        </p>
      </v-col>
      <v-col class="shrink align-center">
        <v-icon>chevron_right</v-icon>
      </v-col>
    </v-row>
    <v-row
      v-for="(leg, index) in generateSteps()"
      :key="index"
      class="mx-1 py-0"
    >
      <itinerary-leg :leg="leg" :showicon="false" :showdottedline="true" />
    </v-row>
    <v-row justify="center">
      <v-col align="start" class="header ma">
        <span>Ontvang </span>
        <strong class="text-color-primary ">5 credits</strong>
      </v-col>
      <v-col align="end">
        <v-btn small rounded depressed color="button">
          {{ btnText }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import moment from 'moment'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'

export default {
  name: 'ShoutOut',
  components: { ItineraryLeg },
  props: {
    shoutout: { type: Object, required: true },
    btnText: { type: String, required: true },
    isMine: { type: Boolean, required: true },
  },
  computed: {
    profile() {
      return this.$store.getters['ps/getUser']
    },
    myProfileImage() {
      return this.$store.getters['ps/getUser'].profile.image
    },
    profileImage() {
      return this.isMine ? this.myProfileImage : this.profile.image
    },
  },
  methods: {
    generateSteps() {
      const ride = this.shoutout
      const departure = moment(ride.departureTime),
        arrival = moment(ride.estimatedArrivalTime)
      return [
        {
          mode: 'CAR',
          startTime: departure.toDate().getTime(),
          endTime: arrival.toDate().getTime(),
          from: { name: ride.from.label },
        },
        {
          mode: 'ARRIVAL',
          startTime: arrival.toDate().getTime(),
          from: { name: ride.to.label },
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.ma {
  margin: auto;
}

.shoutout-container {
  padding: 5px 15px;

  .shoutout-image {
    padding-right: 0;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 0 1px $color-light-grey;
  }
}
</style>
