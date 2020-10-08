<template>
  <v-row no-gutters>
    <v-col>
      <b>{{ leg.driverName }}</b> is de chauffeur.
      <br />
      <round-user-image
        :image-size="60"
        :avatar-size="66"
        :profile-image="driverImage"
      />
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import * as psStore from '@/store/profile-service'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'ItineraryLegDriver',
  components: { RoundUserImage },
  props: {
    leg: { type: Object, required: true },
  },
  computed: {
    driverImage() {
      // driver image changes when the profile of external user has been fetched
      const image = psStore.getters.getExternalUser?.profile?.image
      return image ? `https://api.netmobiel.eu/gwapi/acc/${image}` : null
    },
  },
  mounted() {
    // first fetch the ride from the trip id
    csStore.actions.fetchRide({ id: this.leg.tripId }).then(() => {
      // obtain managed identity of driver once we have a selected ride
      const { managedIdentity } = csStore.getters.getSelectedRide.driver
      // fetch profile of external user
      psStore.actions.fetchUserProfile({ profileId: managedIdentity })
    })
  },
}
</script>

<style lang="scss"></style>
