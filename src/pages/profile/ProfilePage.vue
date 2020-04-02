<template>
  <content-pane>
    <v-layout pa-2 column>
      <v-flex>
        <v-layout row mb-3>
          <v-flex lg1 sm2 xs4>
            <round-user-image></round-user-image>
          </v-flex>

          <v-flex body-2 mt-2>
            <v-layout>
              <v-flex>
                <p class="ma-0">{{ user.fullName }}</p>
                <p class="ma-0">{{ address }}</p>
                <v-rating
                  v-model="user.rating"
                  :length="user.maxRating"
                  background-color="yellow darken-3"
                  color="yellow darken-3"
                  small
                  readonly
                ></v-rating>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex lg1 sm1>
            <v-layout align-center justify-end fill-height>
              <v-flex align-center>
                <v-icon class="align-center">chevron_right</v-icon>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout row mb-2>
          <v-flex travel-card mr-2>
            <v-layout column align-center my-2 class="disabled">
              <v-flex><v-icon>control_point</v-icon></v-flex>
              <v-flex>Doelen</v-flex>
            </v-layout>
          </v-flex>
          <v-flex travel-card ml-2>
            <v-layout column align-center my-2>
              <v-flex @click="$router.push('/credits')"
                ><v-icon>monetization_on</v-icon></v-flex
              >
              <v-flex>Credits beheren</v-flex>
            </v-layout>
          </v-flex>
          <v-flex travel-card ml-2>
            <v-layout column align-center my-2 class="disabled">
              <v-flex><v-icon>star_border</v-icon></v-flex>
              <v-flex>Reviews</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout column>
          <v-flex
            v-for="item in items"
            :key="item.name"
            @click="$router.push(item.route)"
          >
            <v-divider></v-divider>
            <v-layout align-center ma-3 :class="{ 'no-route': !item.route }">
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
      <v-flex travel-card mt-2 mr-2 @click="logOut">
        <v-layout column align-center my-2>
          <v-flex>
            <v-icon>exit_to_app</v-icon>
          </v-flex>
          <v-flex>
            Log out
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import roundUserImage from '@/components/common/RoundUserImage'

export default {
  components: {
    ContentPane,
    roundUserImage,
  },
  data: function() {
    return {
      rating: 4,
      items: [
        {
          icon: 'settings',
          name: 'Instellingen',
          route: '/profileNotificationOptions',
        },
        { icon: 'help_outline', name: 'Veel gestelde vragen', route: '' },
        {
          icon: 'lock',
          name: 'Privacy & beveiliging',
          route: '',
          // route: '/privacySecurity',
        },
        {
          icon: 'chrome_reader_mode',
          name: 'Gebruiksvoorwaarden',
          route: '',
          // route: '/termsOfUse',
        },
        { icon: 'error_outline', name: 'Over deze app', route: '' },
        { icon: 'cancel', name: 'Verwijder mijn account', route: '' },
      ],
      address: 'Gasthuisstraat 9, Bredevoort',
    }
  },
  computed: {
    user() {
      return this.$store.getters['ps/getUser']
    },
  },
  methods: {
    navToHome: function() {
      this.$router.push('/')
    },
    logOut: function() {
      this.$keycloak.logoutFn()
      this.$store.commit('ui/deleteAccessToken')
    },
  },
}
</script>

<style lang="scss">
.theme--light.v-icon {
  color: $color-green;
}
.v-rating .v-icon {
  padding: 0px;
}
.no-route {
  color: $color-light-grey;
}

.disabled {
  color: #ccc;
}
//TEMP: Just to pretend disabled buttons
.disabled .v-icon {
  color: #ccc;
}
</style>
