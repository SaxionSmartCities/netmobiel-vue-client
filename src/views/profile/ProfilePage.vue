<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <v-layout row mb-2>
          <v-flex travel-card mr-2
            ><v-layout column align-center my-2
              ><v-flex><v-icon>control_point</v-icon></v-flex
              ><v-flex>Doelen</v-flex></v-layout
            ></v-flex
          >
          <v-flex travel-card ml-2
            ><v-layout column align-center my-2
              ><v-flex><v-icon>star_border</v-icon></v-flex
              ><v-flex>Reviews</v-flex></v-layout
            ></v-flex
          >
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout column>
          <v-flex v-for="item in items" :key="item.name" @click="$router.push(item.route)">
            <v-divider></v-divider>
            <v-layout align-center ma-3>
              <v-flex xs2>
                <v-icon>{{ item.icon }}</v-icon>
              </v-flex>
              <v-flex>{{ item.name }}</v-flex>
              <v-flex xs1>
                <v-icon>chevron_right</v-icon>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: function() {
    return {
      items: [
        { icon: 'settings', name: 'Instellingen', route: '' },
        { icon: 'help_outline', name: 'Veel gestelde vragen', route: '' },
        {
          icon: 'lock',
          name: 'Privacy & beveiliging',
          route: '/privacyStatement',
        },
        { icon: 'chrome_reader_mode', name: 'Gebruiksvoorwaarden', route: '/termsOfUse' },
        { icon: 'error_outline', name: 'Over deze app', route: '' },
        { icon: 'cancel', name: 'Verwijder mijn account', route: '' },
      ],
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser
    },
  },
  methods: {
    navToHome: function() {
      this.$router.push('/')
    },
  },
}
</script>

<style lang="scss">
.theme--light.v-icon {
  color: $color-green;
}
#container {
  background: #ffffff;
  border-radius: $form-border-radius;
  height: calc(100% - 50px - 40px);
  width: 100%;
  margin-top: calc(50px + 20px);
}
</style>
