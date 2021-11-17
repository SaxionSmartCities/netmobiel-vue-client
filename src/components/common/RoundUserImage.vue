<template>
  <v-avatar :size="avatarSize">
    <!-- src="@/asset/image-name" images are passed through webpack. These must reference a full name, no
        javascript constructs. See https://cli.vuejs.org/guide/html-and-static-assets.html#the-public-folder
    -->
    <v-img
      v-if="isSystemImage"
      src="@/assets/system-avatar.png"
      :max-height="imageSize"
      :max-width="imageSize"
    />
    <v-img
      v-else-if="profileImage"
      :src="profileImage"
      :max-height="imageSize"
      :max-width="imageSize"
    />
    <v-img
      v-else
      src="@/assets/default_profile_image.png"
      :max-height="imageSize"
      :max-width="imageSize"
    />
  </v-avatar>
</template>

<script>
import constants from '@/constants/constants'

export default {
  name: 'RoundUserImage',
  props: {
    imageSize: {
      type: Number,
      default: 70,
      required: false,
    },
    avatarSize: {
      type: Number,
      default: 78,
      required: false,
    },
    profileImage: {
      type: String,
      default: '',
      required: false,
    },
  },
  computed: {
    isSystemImage() {
      return this.profileImage === constants.SYSTEM_AVATAR
    },
  },
}
</script>

<style lang="scss">
.v-avatar {
  border: 1px solid $color-light-grey;
}
</style>
