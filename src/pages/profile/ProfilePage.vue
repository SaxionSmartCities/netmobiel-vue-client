<template>
  <content-pane :clearpadding="true" class="pa-0">
    <v-row class="pt-2 flex-column">
      <v-col>
        <v-row class="mb-3">
          <v-col class="shrink pa-0 pr-3">
            <round-user-image
              :image-size="92"
              :avatar-size="100"
            ></round-user-image>
            <div class="d-flex flex-column align-center">
              <a
                class="caption bewerk"
                @click="showUploadFile = !showUploadFile"
              >
                Bewerk
              </a>
              <!--UPLOAD-->
              <div v-if="showUploadFile" class="text-center">
                <label for="file-input" class="custom-file-upload">
                  Upload afbeelding
                  <input id="file-input" type="file" @change="readFile" />
                  <v-progress-circular
                    v-if="isUploadingFile"
                    indeterminate
                    color="btn-primary"
                  ></v-progress-circular>
                </label>
              </div>
            </div>
          </v-col>
          <v-col class="flex-column">
            <v-row>
              <div
                class="d-flex grow align-self-center flex-column user-text"
                @click="navTo('account')"
              >
                <span class="shrink">{{ user.fullName }}</span>
                <span class="caption text--gray">
                  {{ userAddress }}
                </span>
              </div>
              <v-icon large @click="navTo('account')">
                chevron_right
              </v-icon>
            </v-row>
            <v-row class="mt-5">
              <v-col class="pa-0 shrink">
                <div>
                  <v-btn
                    rounded
                    depressed
                    color="button"
                    small
                    @click="navTo('credits')"
                  >
                    Beheer credits
                  </v-btn>
                  <div class="py-1"></div>
                  <v-btn rounded depressed outlined color="primary" small>
                    Bekijk reviews
                  </v-btn>
                </div>
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
  data() {
    return {
      rating: 4,
      showUploadFile: false,
      isUploadingFile: false,
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
    }
  },
  computed: {
    user() {
      return this.$store.getters['ps/getUser']
    },
    userAddress() {
      let formatted = 'Onbekende woonplaats'
      const address = this.user.profile.address
      if (address['locality'] && address['street']) {
        formatted = address['houseNumber']
          ? `${address['street']} ${address['houseNumber']},
              ${address['locality']}`
          : `${address['street']}, ${address['locality']}`
      } else if (address['locality']) {
        formatted = address['locality']
      }
      return formatted
    },
  },
  methods: {
    navTo(name) {
      this.$router.push({ name: name })
    },
    logOut: function() {
      this.$keycloak.logoutFn()
      this.$store.commit('ui/deleteAccessToken')
    },
    readFile(event) {
      if (event.target.files[0]) {
        let fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.isUploadingFile = true
        })
        fileReader.addEventListener('loadend', () => {
          this.isUploadingFile = false
          //Update profile
          let profile = { ...this.$store.getters['ps/getProfile'] }
          // fileReader.result = base64 encoded string
          profile.image = fileReader.result
          this.$store.dispatch('ps/updateProfile', profile)
        })
        fileReader.readAsDataURL(event.target.files[0])
      }
    },
  },
}
</script>

<style lang="scss">
#file-input {
  display: none;
}
.user-text {
  flex: 0 1 0;
}

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
