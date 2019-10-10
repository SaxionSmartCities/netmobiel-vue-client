<template>
  <v-layout header fill-height align-center>
    <v-flex v-if="isBackButtonVisible" xs1 text-xs-center @click="goBack()">
      <v-icon id="backButton">arrow_back</v-icon>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    isBackButtonVisible: function() {
      return this.$store.getters['ui/isBackButtonVisible']
    },
  },
  methods: {
    goBack: function() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss">
.header {
  background: $color-green;
  background-image: url('../../assets/logo_header.png');
  background-size: 120px;
  background-repeat: no-repeat;
  background-position: center center;
}

#backButton {
  color: $color-white;
}
</style>
