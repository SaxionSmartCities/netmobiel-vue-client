<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <v-layout row my-3 mr-3>
          <v-flex lg1 sm2 xs4>
            <v-avatar id="profileImage" :size="size">
              <img :src="avatar" />
            </v-avatar>
          </v-flex>

          <v-flex>
            <v-layout class="mt-2">
              <v-flex>
                <p class="ma-0">{{ getUserData().fullName }}</p>
                <p class="ma-0">{{ address }}</p>
                <v-layout row>
                  <v-flex>
                    <v-rating
                      v-model="rating"
                      background-color="yellow darken-3"
                      color="yellow darken-3"
                      :length="getStars"
                      small
                    ></v-rating>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex lg1>
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
          <v-flex
            v-for="item in items"
            :key="item.name"
            @click="$router.push(item.route)"
          >
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
      rating: 4,
      items: [
        { icon: 'settings', name: 'Instellingen', route: '' },
        { icon: 'help_outline', name: 'Veel gestelde vragen', route: '' },
        {
          icon: 'lock',
          name: 'Privacy & beveiliging',
          route: '/privacyStatment',
        },
        {
          icon: 'chrome_reader_mode',
          name: 'Gebruiksvoorwaarden',
          route: '/termsOfUse',
        },
        { icon: 'error_outline', name: 'Over deze app', route: '' },
        { icon: 'cancel', name: 'Verwijder mijn account', route: '' },
      ],
      avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      size: 70,
      address: 'Gasthuisstraat 9, Bredevoort',
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser
    },
    getStars() {
      return 3
    },
  },
  methods: {
    navToHome: function() {
      this.$router.push('/')
    },
    getUserData() {
      return this.$store.getters.getUser
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
.v-rating .v-icon {
  padding: 0px;
}
</style>
