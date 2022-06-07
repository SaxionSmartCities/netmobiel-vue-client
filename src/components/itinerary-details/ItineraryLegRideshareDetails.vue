<template>
  <v-row dense>
    <v-col>
      <v-row
        v-if="showProfile && otherPerson.managedIdentity !== profile.id"
        dense
        class="mt-1 align-center"
      >
        <v-col class="shrink">
          <external-user-image
            :managed-identity="otherPerson.managedIdentity"
            :image-size="54"
            :avatar-size="60"
          />
        </v-col>
        <v-col v-if="canViewProfile" class="text-center">
          <v-btn small rounded outlined color="primary" @click="onClickOther">
            Bekijk Profiel
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col v-if="isPassengersLeg">
          <span v-if="otherPerson.managedIdentity === profile.id">
            <strong>Jij</strong> bent de chauffeur.
          </span>
          <span v-else>
            <strong>{{ otherPerson.name }}</strong> is de chauffeur.
          </span>
        </v-col>
        <v-col v-else>
          <strong>{{ otherPerson.name }}</strong> rijdt mee.
        </v-col>
      </v-row>
      <v-row v-if="vehicleDetails" dense>
        <v-col>
          <span>{{ vehicleDetails }}</span>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ExternalUserImage from '@/components/profile/ExternalUserImage'
import * as psStore from '@/store/profile-service'

export default {
  name: 'ItineraryLegRideshareDetails',
  components: { ExternalUserImage },
  props: {
    otherPerson: { type: Object, required: true },
    isPassengersLeg: { type: Boolean, required: true },
    vehicleDetails: { type: String, required: false, default: '' },
    showProfile: { type: Boolean, required: false, default: true },
    canViewProfile: { type: Boolean, required: false, default: true },
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
  },
  methods: {
    onClickOther() {
      this.$router.push({
        name: 'userProfile',
        params: {
          profileId: this.otherPerson.managedIdentity,
        },
      })
    },
  },
}
</script>

<style lang="scss"></style>
