<template>
  <round-user-image
    :profile-image="imageURL"
    :image-size="imageSize"
    :avatar-size="avatarSize"
  />
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import * as psStore from '@/store/profile-service'
import constants from '@/constants/constants'

export default {
  name: 'ExternalUserImage',
  components: { RoundUserImage },
  props: {
    managedIdentity: { type: String, required: true },
    imageSize: { type: Number, default: 70, required: false },
    avatarSize: { type: Number, default: 78, required: false },
  },
  computed: {
    isSystemUser() {
      return this.managedIdentity === constants.SYSTEM_IDENTITY
    },
    publicUser() {
      if (this.managedIdentity && !this.isSystemUser) {
        return psStore.getters.getPublicUsers.get(this.managedIdentity)
      }
      return null
    },
    imageURL() {
      return this.isSystemUser
        ? constants.SYSTEM_AVATAR
        : this.publicUser?.profile.image
    },
  },
  watch: {
    managedIdentity() {
      this.fetchExternalUser()
    },
  },
  mounted() {
    this.fetchExternalUser()
  },
  methods: {
    fetchExternalUser() {
      if (this.managedIdentity && !this.isSystemUser) {
        psStore.actions.fetchPublicProfile({ profileId: this.managedIdentity })
      }
    },
  },
}
</script>
