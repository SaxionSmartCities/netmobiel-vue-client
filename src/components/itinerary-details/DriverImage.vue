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
      managedIdentity: '',
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
      const driverId = this.leg.driverId
      if (driverId) {
        csStore.actions.fetchUser({ userRef: driverId }).then(resp => {
          this.managedIdentity = resp.managedIdentity
        })
      }
    },
  },
}
</script>
