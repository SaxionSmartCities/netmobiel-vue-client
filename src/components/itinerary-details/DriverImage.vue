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
import * as UrnHelper from '@/utils/UrnHelper'

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
      if (driverId && UrnHelper.isUrn(driverId)) {
        const decodedUrn = UrnHelper.decodeUrn(driverId)
        if (decodedUrn.service === UrnHelper.NETMOBIEL_SERVICE.KEYCLOAK) {
          this.managedIdentity = decodedUrn.id
        } else if (
          decodedUrn.service === UrnHelper.NETMOBIEL_SERVICE.RIDESHARE
        ) {
          // The mapping is cached
          csStore.actions.fetchUser({ userRef: driverId }).then(resp => {
            this.managedIdentity = resp.managedIdentity
          })
        }
      }
    },
  },
}
</script>
