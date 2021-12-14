<template>
  <external-user-image
    :managed-identity="driverManagedIdentity"
    :image-size="imageSize"
    :avatar-size="avatarSize"
  />
</template>

<script>
import ExternalUserImage from '@/components/profile/ExternalUserImage'
import * as UrnHelper from '@/utils/UrnHelper'

export default {
  name: 'DriverImage',
  components: { ExternalUserImage },
  props: {
    leg: { type: Object, required: true },
    imageSize: { type: Number, default: 54, required: false },
    avatarSize: { type: Number, default: 60, required: false },
  },
  computed: {
    driverManagedIdentity() {
      const driverId = this.leg?.driverId
      if (driverId && UrnHelper.isUrn(driverId)) {
        const decodedUrn = UrnHelper.decodeUrn(driverId)
        if (decodedUrn.service === UrnHelper.NETMOBIEL_SERVICE.KEYCLOAK) {
          return decodedUrn.id
        }
      }
      return undefined
    },
  },
}
</script>
