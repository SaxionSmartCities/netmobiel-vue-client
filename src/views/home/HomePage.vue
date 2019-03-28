<template>
  <div class="container">
    <div class="mt-3 mb-3 box-widget text-center background-primary">
      <h3>Hoi {{ user.name }}</h3>
      <p>Welkom bij Netmobiel!</p>
    </div>

    <router-link to="/search" class="btn btn-block btn-primary">
      Ik wil een reis zoeken!
    </router-link>
    <button class="btn btn-block btn-primary">
      Ik wil een reis aanbieden!
    </button>
    <router-link to="/createUser" class="btn btn-block btn-primary">
      Ik wil als nog een account aanmaken!
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.getUser
    },
  },
}
</script>

<style lang="scss"></style>
