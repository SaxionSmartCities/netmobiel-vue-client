<template>
  <content-pane>
    <v-row dense>
      <v-col>
        <v-row dense>
          <v-col class="shrink d-flex flex-column align-center">
            <round-user-image
              :image-size="92"
              :avatar-size="100"
              :profile-image="profileImage"
            ></round-user-image>
            <a class="caption bewerk" @click="showUploadFile = !showUploadFile">
              Bewerk
            </a>
            <!--UPLOAD-->
            <div v-if="showUploadFile" class="text-center">
              <label for="file-input" class="custom-file-upload caption">
                Upload afbeelding
                <input id="file-input" type="file" @change="readFile" />
                <v-progress-circular
                  v-if="isUploadingFile"
                  indeterminate
                  color="button"
                ></v-progress-circular>
              </label>
            </div>
          </v-col>
          <v-col>
            <v-row dense class="profile-item" @click="navTo('account')">
              <v-col class="d-flex flex-row flex-nowrap">
                <v-row dense>
                  <v-col class="d-flex flex-column">
                    <span class="shrink">{{ fullName }}</span>
                    <span class="caption text--gray">
                      {{ userAddress }}
                    </span>
                  </v-col>
                  <v-col class="shrink">
                    <v-icon large> chevron_right </v-icon>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-row dense>
                  <v-col>
                    <v-btn
                      v-if="creditsEnabled"
                      rounded
                      depressed
                      small
                      class="long"
                      color="button"
                      @click="navTo('credits')"
                    >
                      Beheer credits
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <v-btn
                      rounded
                      depressed
                      outlined
                      small
                      class="long"
                      color="primary"
                      @click="navReview"
                    >
                      Bekijk beoordelingen
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list>
          <template v-for="(item, index) in items">
            <v-divider
              v-show="index !== 0"
              :key="'divider-' + index"
            ></v-divider>
            <v-list-item
              :key="index"
              dense
              class="profile-item"
              @click="!item.routeName || $router.push({ name: item.routeName })"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content
                class="body-1 font-weight-light"
                :class="{ 'no-route': !item.routeName }"
              >
                {{ item.name }}</v-list-item-content
              >
              <v-list-item-icon>
                <v-icon>chevron_right</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn large rounded block outlined color="primary" @click="logOut">
          Afmelden
          <v-icon right> logout </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import RoundUserImage from '@/components/common/RoundUserImage'
import { scaleImageDown } from '../../utils/image_scaling'
import * as psStore from '@/store/profile-service'
import config from '@/config/config'

const CREDITS_ENABLED = config.CREDITS_ENABLED

export default {
  name: 'ProfilePage',
  components: {
    ContentPane,
    RoundUserImage,
  },
  data() {
    return {
      rating: 4,
      showUploadFile: false,
      isUploadingFile: false,
      creditsEnabled: CREDITS_ENABLED || false,
      items: [
        {
          icon: 'settings',
          name: 'Instellingen',
          routeName: 'notificationOptions',
        },
        { icon: 'help_outline', name: 'Veelgestelde vragen', routeName: '' },
        {
          icon: 'lock',
          name: 'Privacy & beveiliging',
          routeName: '',
        },
        {
          icon: 'chrome_reader_mode',
          name: 'Gebruiksvoorwaarden',
          routeName: '',
        },
        { icon: 'error_outline', name: 'Over deze app', routeName: 'about' },
        { icon: 'cancel', name: 'Verwijder mijn account', routeName: '' },
      ],
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    profileImage() {
      return this.profile.image
    },
    fullName() {
      const { firstName, lastName } = this.profile
      return `${firstName} ${lastName}`
    },
    userAddress() {
      let formatted = this.profile?.address?.locality || 'Onbekende woonplaats'
      const address = this.profile?.address
      if (address && address['locality'] && address['street']) {
        formatted = address['houseNumber']
          ? `${address['street']} ${address['houseNumber']},
              ${address['locality']}`
          : `${address['street']}, ${address['locality']}`
      }
      return formatted
    },
  },
  methods: {
    navTo(name) {
      this.$router.push({ name: name })
    },
    logOut: function () {
      this.$router.push({ name: 'logout' })
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
          scaleImageDown(imageString, 200).then((resizedImage) => {
            psStore.actions
              .updateMyProfileImage({
                image: resizedImage,
              })
              .then(() => psStore.actions.fetchMyProfile())
          })
        })
        fileReader.readAsDataURL(event.target.files[0])
      }
    },
    navReview() {
      this.$router.push({
        name: 'userProfile',
        params: {
          profileId: psStore.getters.getProfile.id,
        },
      })
    },
  },
}
</script>

<style lang="scss">
#file-input {
  display: none;
}
.theme--light.v-icon {
  color: $color-green;
}
.v-rating .v-icon {
  padding: 0;
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
.long {
  width: 200px;
}
.profile-item {
  cursor: pointer;
}
</style>
