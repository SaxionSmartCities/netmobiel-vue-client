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
  data() {
    return {
      imageURL: null,
    }
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
      // fetch profile of external user
      psStore.actions
        .fetchUserProfile({ profileId: this.managedIdentity })
        .then(() => {
          // extract the image from external profile (because external profile might change again...)
          const { image } = psStore.getters.getExternalUser.profile
          this.imageURL = image ? `${config.BASE_URL}/${image}` : null
        })
    },
  },
}
</script>
