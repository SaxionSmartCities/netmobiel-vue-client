<template>
  <v-card
    outlined
    class="shoutout-container"
    @click="$emit('shoutoutSelected', index)"
  >
    <v-row>
      <v-col class="shrink">
        <v-img class="shoutout-image" :src="profile.image" />
      </v-col>
      <v-col class="shrink">
        <div class="d-flex flex-column">
          <span class="font-weight-regular subtitle-2">Reiziger</span>
          <span class="subtitle-1 font-weight-light">
            {{ shoutout.traveller.givenName }}
          </span>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end">
          <v-icon>chevron_right</v-icon>
        </div>
      </v-col>
    </v-row>
    <v-row
      v-for="(leg, index) in generateSteps()"
      :key="index"
      class="mx-3 py-0"
    >
      <itinerary-leg :leg="leg" />
    </v-row>
    <v-row justify="center">
      <v-col align="start" class="header ma">
        <span>Ontvang </span>
        <strong class="text-color-primary ">5 credits</strong>
      </v-col>
      <v-col align="end">
        <v-btn small rounded depressed color="button">Rit aanbieden</v-btn>
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
  },
  computed: {
    profile() {
      return this.$store.getters['ps/getUser']
    },
  },
  methods: {
    doSomething() {
      console.log('hello 123')
    },
    generateSteps() {
      const ride = this.shoutout
      console.log(this.shoutout)
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
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
</style>
