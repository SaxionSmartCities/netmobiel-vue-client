<template>
  <content-pane :clearpadding="true" class="pa-0">
    <v-row class="pt-2 flex-column">
      <v-col>
        <v-row class="mb-3">
          <v-col class="shrink pa-0 pr-3">
            <round-user-image
              :image-size="92"
              :avatar-size="100"
              :profile-image="profileImage"
            ></round-user-image>
            <img class="d-flex flex-column align-center" />
            <div class="d-flex flex-row justify-center">
              <a
                class="caption bewerk"
                @click="showUploadFile = !showUploadFile"
              >
                Bewerk
              </a>
            </div>
            <!--UPLOAD-->
            <div v-if="showUploadFile" class="text-center">
              <label for="file-input" class="custom-file-upload caption">
                Upload afbeelding
                <input id="file-input" type="file" @change="readFile" />
                <v-progress-circular
                  v-if="isUploadingFile"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </label>
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
    </v-row>
    <v-row dense>
      <v-col class="pa-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row
      v-for="item in items"
      :key="item.name"
      class="pa-0 ml-0 mr-1"
      align-content="center"
      :class="{ 'no-route': !item.routeName }"
      @click="!item.routeName || $router.push({ name: item.routeName })"
    >
      <v-col class="pa-0">
        <v-row dense class="py-3">
          <v-icon class="pl-1">{{ item.icon }}</v-icon>
          <span class="pl-4 body-1 font-weight-light align-self-center">
            {{ item.name }}
          </span>
          <v-spacer></v-spacer>
          <v-icon>chevron_right</v-icon>
        </v-row>
        <v-row dense>
          <v-col class="py-0">
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="mt-2" @click="logOut">
          <v-row>
            <v-col class="grow pl-6">
              Uitloggen
            </v-col>
            <v-col class="shrink pr-5">
              <v-icon>exit_to_app</v-icon>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import RoundUserImage from '@/components/common/RoundUserImage'
import { scaleImageDown } from '../../utils/image_scaling'
import * as psStore from '@/store/profile-service'
import * as uiStore from '@/store/ui'

export default {
  components: {
    ContentPane,
    RoundUserImage,
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
          routeName: 'notificationOptions',
        },
        { icon: 'help_outline', name: 'Veel gestelde vragen', routeName: '' },
        {
          icon: 'lock',
          name: 'Privacy & beveiliging',
          routeName: '',
          // route: '/privacySecurity',
        },
        {
          icon: 'chrome_reader_mode',
          name: 'Gebruiksvoorwaarden',
          routeName: '',
          // route: '/termsOfUse',
        },
        { icon: 'error_outline', name: 'Over deze app', routeName: 'about' },
        { icon: 'cancel', name: 'Verwijder mijn account', routeName: '' },
      ],
    }
  },
  computed: {
    user() {
      return psStore.getters.getUser
    },
    userAddress() {
      let formatted =
        this.user.profile?.address?.locality || 'Onbekende woonplaats'
      const address = this.user.profile.address
      if (address && address['locality'] && address['street']) {
        formatted = address['houseNumber']
          ? `${address['street']} ${address['houseNumber']},
              ${address['locality']}`
          : `${address['street']}, ${address['locality']}`
      }
      return formatted
    },
    profileImage() {
      return psStore.getters.getUser.profile.image
    },
  },
  methods: {
    navTo(name) {
      this.$router.push({ name: name })
    },
    logOut: function() {
      this.$keycloak.logoutFn()
      uiStore.mutations.deleteAccessToken()
    },
    readFile(event) {
      if (event.target.files[0]) {
        let fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.isUploadingFile = true
        })
        fileReader.addEventListener('loadend', async () => {
          this.isUploadingFile = false
          const imageString = fileReader.result
          scaleImageDown(imageString, 20).then(resizedImage => {
            const profile = { ...psStore.getters.getProfile }
            psStore.actions.updateProfileImage({
              id: profile.id,
              image: resizedImage,
            })
          })
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
