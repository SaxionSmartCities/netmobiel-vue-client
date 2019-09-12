<template>
  <v-avatar :size="sizeAv">
    <v-img
      :src="getUserData().image"
      :max-height="sizeImg"
      :max-width="sizeImg"
    />
  </v-avatar>
</template>

<script>
export default {
  name: 'RoundUserImage',
  data() {
    return {
      sizeImg: 70,
      sizeAv: 78,
    }
  },
  methods: {
    getUserData() {
      return this.$store.getters['ps/getUser']
    },
  },
}
</script>

<style lang="scss">
.v-avatar {
  border: 1px solid $color-light-grey;
}
</style>
