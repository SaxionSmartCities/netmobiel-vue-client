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
import * as csStore from '@/store/carpool-service'
import config from '@/config/config'

export default {
  name: 'ExternalUserImage',
  components: { RoundUserImage },
  props: {
    managedIdentity: { type: String, required: true },
    imageSize: { type: Number, default: 70, required: false },
    avatarSize: { type: Number, default: 78, required: false },
  },
  computed: {
    publicUser() {
      if (this.managedIdentity) {
        return psStore.getters.getPublicUsers.get(this.managedIdentity)
      }
      return null
    },
    imageURL() {
      return this.publicUser?.profile.image
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
      if (this.managedIdentity) {
        psStore.actions.fetchPublicProfile({ profileId: this.managedIdentity })
      }
    },
  },
}
</script>
