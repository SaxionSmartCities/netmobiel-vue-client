<template>
  <v-layout header fill-height justify-end align-center></v-layout>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    // logout: function() {
    // },
  },
}
</script>

<style lang="scss">
.header {
  background: $color-green;
  background-image: url('../../assets/logo_header.png');
  background-size: 40% auto;
  background-repeat: no-repeat;
  background-position: center center;
}

#logout-button {
  background-color: $color-orange;
  color: white;
}
</style>
