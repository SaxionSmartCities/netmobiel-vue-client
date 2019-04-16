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

    <!-- <div class="container">
      <div class="row mt-2">
        <router-link to="/home" class="text-secondary text-center">
          <div class="col">
            <i class="fas fa-home"></i>
            <p class="text-small">Home</p>
          </div>
        </router-link>
        <router-link to="/home" class="text-secondary text-center">
          <div class="col">
            <i class="fas fa-suitcase"></i>
            <p class="text-small">Reizen</p>
          </div>
        </router-link>
        <div class="col"></div>
        <router-link to="/home" class="text-secondary text-center">
          <div class="col">
            <i class="fas fa-car"></i>
            <p class="text-small">Aanbieden</p>
          </div>
        </router-link>
        <router-link to="/home" class="text-secondary text-center">
          <div class="col">
            <i class="fas fa-user"></i>
            <p class="text-small">Profiel</p>
          </div>
        </router-link>
      </div>
    </div> -->
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
