<template>
  <v-avatar :size="getSizeAv">
    <v-img
      :src="getUserData().image"
      :max-height="sizeImg"
      :max-width="sizeImg"
    />
  </v-avatar>
</template>

<script>
export default {
  name: 'RoundImage',
  props: {
    sizeImg: { type: Number, default: 70 },
  },
  computed: {
    getSizeAv() {
      return this.sizeImg + 8
    },
  },
  methods: {
    getUserData() {
      return this.$store.getters.getUser
    },
  },
}
</script>

<style lang="scss">
.v-avatar {
  border: 1px solid $color-headerGray;
}
</style>
