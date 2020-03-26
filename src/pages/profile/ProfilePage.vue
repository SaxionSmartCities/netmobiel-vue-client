<template>
  <content-pane>
    <v-row class="pt-2 flex-column">
      <v-col class="pa-0">
        <v-row class="mb-3">
          <v-col class="shrink py-0 pr-7" lg="1" sm="2">
            <round-user-image></round-user-image>
            <div class="d-flex flex-row justify-center">
              <a class="caption bewerk">Bewerk</a>
            </div>
          </v-col>

          <v-col class="pa-0" body-2 mt-2>
            <v-row class="d-flex flex-column">
              <v-col class="pa-0 pl-3 pt-3 flex-row">
                <v-row class="d-flex flex-row shrink">
                  <v-col
                    cols="9"
                    class="pa-0 d-flex flex-column"
                    @click="navToAccount"
                  >
                    <span class="ma-0">{{ user.fullName }}</span>
                    <span class="ma-0 caption text--">{{ address }}</span>
                  </v-col>
                  <v-col class="pa-0  shrink align-self-center">
                    <v-icon large @click="navToAccount">chevron_right</v-icon>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="pl-0 mt-1">
                <v-btn rounded depressed color="button" small>
                  Beheer credits
                </v-btn>
                <div class="py-1"></div>
                <v-btn rounded depressed outlined color="primary" small>
                  Bekijk reviews
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="pa-0">
        <v-layout column>
          <v-flex
            v-for="item in items"
            :key="item.name"
            @click="$router.push(item.route)"
          >
            <v-divider></v-divider>
            <v-row
              align-content="center"
              class="my-3 ml-0 mr-1"
              :class="{ 'no-route': !item.route }"
            >
              <v-icon>{{ item.icon }}</v-icon>
              <span class="pl-4 body-1 font-weight-light align-self-center">
                {{ item.name }}
              </span>
              <v-spacer></v-spacer>
              <v-icon>chevron_right</v-icon>
            </v-row>
          </v-flex>
        </v-layout>
      </v-col>
      <v-col travel-card mt-2 mr-2 @click="logOut">
        <v-layout column align-center my-2>
          <v-flex>
            <v-icon>exit_to_app</v-icon>
          </v-flex>
          <v-flex>
            Log out
          </v-flex>
        </v-layout>
      </v-col>
    </v-row>
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
    navToAccount() {
      this.$router.push({ name: 'account' })
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
.bewerk {
  text-decoration: underline;
}
</style>
