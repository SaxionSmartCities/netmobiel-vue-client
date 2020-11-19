<template>
  <v-card
    outlined
    class="shoutout-container"
    @click="
      $emit('shoutoutSelected', { id: shoutout.planRef, isUserTraveller })
    "
  >
    <v-row class="mb-2">
      <v-col class="shrink">
        <v-img
          v-if="isUserTraveller"
          class="shoutout-image"
          :src="profileImage"
        />
        <external-user-image v-else :managed-identity="travellerIdentity" />
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
          {{ nextAction }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { getDistance } from 'geolib'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ExternalUserImage from '@/components/profile/ExternalUserImage.vue'
import constants from '@/constants/constants'
import { generateShoutOutDetailSteps } from '@/utils/itinerary_steps.js'
import * as psStore from '@/store/profile-service'

export default {
  name: 'ShoutOut',
  components: { ItineraryLeg, ExternalUserImage },
  props: {
    shoutout: { type: Object, required: true },
  },
  computed: {
    profile() {
      return psStore.getters.getUser.profile
    },
    profileImage() {
      return this.profile.image
    },
    isUserTraveller() {
      return this.profile.id === this.travellerIdentity
    },
    travellerName() {
      const { traveller } = this.shoutout
      if (this.isUserTraveller) {
        return `${traveller.firstName} ${traveller.lastName}`
      }
      return `${traveller.givenName} ${traveller.familyName}`
    },
    distance() {
      return getDistance(this.shoutout.from, this.shoutout.to, 1000) / 1000
    },
    travellerIdentity() {
      const { traveller } = this.shoutout
      return traveller.managedIdentity
        ? traveller.managedIdentity
        : traveller.id
    },
    nextAction() {
      return this.isUserTraveller ? 'Bekijk shoutout' : 'Rit aanbieden'
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
