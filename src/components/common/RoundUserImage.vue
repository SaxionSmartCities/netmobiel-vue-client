<template>
  <v-avatar :size="avatarSize">
    <!-- HACK: Passing @/asset/.. as default value for profileImage will not
    load image in v-img. Added work around with v-if else  -->
    <v-img
      v-if="profileImage"
      :src="profileImage"
      :max-height="imageSize"
      :max-width="imageSize"
    />
    <v-img
      v-else
      src="@/assets/profile_img.png"
      :max-height="imageSize"
      :max-width="imageSize"
    />
  </v-avatar>
</template>

<script>
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
}
</script>

<style lang="scss">
.v-avatar {
  border: 1px solid $color-light-grey;
}
</style>
