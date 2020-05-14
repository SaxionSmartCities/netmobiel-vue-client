<template>
  <v-avatar :size="avatarSize">
    <v-img :src="profileImage" :max-height="imageSize" :max-width="imageSize" />
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
      required: true,
    },
  },
}
</script>

<style lang="scss">
.v-avatar {
  border: 1px solid $color-light-grey;
}
</style>
