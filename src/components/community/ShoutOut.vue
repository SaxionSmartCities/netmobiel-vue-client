<template>
  <v-card
    outlined
    class="shoutout-container"
    @click="$emit('shoutoutSelected', shoutout.planRef)"
  >
    <v-row class="mb-2">
      <v-col class="shrink">
        <v-img class="shoutout-image" :src="profileImage" />
      </v-col>
      <v-col>
        <p class="font-weight-regular header mb-0">Reiziger</p>
        <p class="font-weight-light subtitle-1 mb-0">
          {{ travellerName }}
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
        <span>Afstand </span>
        <strong class="text-color-primary ">{{ distance }} km</strong>
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
import { getDistance } from 'geolib'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import constants from '@/constants/constants'
import { generateShoutOutDetailSteps } from '@/utils/itinerary_steps.js'
import * as psStore from '@/store/profile-service'

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
      return psStore.getters.getUser.profile
    },
    profileImage() {
      return this.isMine ? this.profile.image : constants.defaultProfileImage
    },
    travellerName() {
      const { traveller } = this.shoutout
      if (this.isMine) {
        return `${traveller.firstName} ${traveller.lastName}`
      }
      return `${traveller.givenName} ${traveller.familyName}`
    },
    distance() {
      return getDistance(this.shoutout.from, this.shoutout.to, 1000) / 1000
    },
  },
  methods: {
    generateSteps() {
      return generateShoutOutDetailSteps(this.shoutout)
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
