<template>
  <external-user-image
    :managed-identity="managedIdentity"
    :image-size="imageSize"
    :avatar-size="avatarSize"
  />
</template>

<script>
import ExternalUserImage from '@/components/profile/ExternalUserImage'
import * as psStore from '@/store/profile-service'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'DriverImage',
  components: { ExternalUserImage },
  props: {
    leg: { type: Object, required: true },
    imageSize: { type: Number, default: 70, required: false },
    avatarSize: { type: Number, default: 78, required: false },
  },
  data() {
    return {
      managedIdentity: null,
    }
  },
  watch: {
    leg() {
      // if the leg changes, the driver probably changes as well
      this.fetchDriverIdentity()
    },
  },
  mounted() {
    this.fetchDriverIdentity()
  },
  methods: {
    fetchDriverIdentity() {
      // first fetch the ride from the trip id
      csStore.actions.fetchRide({ id: this.leg.tripId }).then(() => {
        // obtain managed identity of driver once we have a selected ride
        const { driver } = csStore.getters.getSelectedRide
        this.managedIdentity = driver.managedIdentity
      })
    },
  },
}
</script>
