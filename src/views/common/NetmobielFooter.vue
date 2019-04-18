<template>
  <footer v-if="isVisible">
    <v-bottom-nav
      :active.sync="selectedNav"
      :value="true"
      absolute
      color="transparant"
    >
      <v-btn flat value="plan-trip">
        <span>Reis plannen</span>
        <v-icon>commute</v-icon>
      </v-btn>

      <v-btn flat value="saved">
        <span>Bewaard</span>
        <v-icon>favorite</v-icon>
      </v-btn>

      <v-btn flat value="community">
        <span>Community</span>
        <v-icon>chat</v-icon>
      </v-btn>

      <v-btn flat value="profile">
        <span>Profiel</span>
        <v-icon>person</v-icon>
      </v-btn>
    </v-bottom-nav>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data: function() {
    return {
      selectedNav: '',
    }
  },
  computed: {
    isVisible: function() {
      return this.$store.getters.isFooterVisible
    },
  },
}
</script>

<style lang="scss"></style>
