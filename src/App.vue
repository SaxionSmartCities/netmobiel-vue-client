<template>
  <v-app id="app">
    <!-- Header -->
    <v-app-bar v-if="isHeaderVisible" flat app color="primary">
      <v-btn v-if="isBackButtonVisible" icon @click="goBack()">
        <v-icon color="white">arrow_back</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <!-- Show only when a profile has been created and the profile id (managed identity) is defined -->
      <v-btn v-if="isProfileManaged" icon @click="onProfileImageClick">
        <round-user-image
          :profile-image="profileImage"
          :image-size="30"
          :avatar-size="34"
        />
      </v-btn>
    </v-app-bar>
    <!-- Content -->
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-snackbar
      v-if="isNotificationBarVisible"
      v-model="isNotificationBarVisible"
      :timeout="-1"
      :color="notificationColor"
      bottom
      absolute
    >
      <v-row dense>
        <v-col class="grow">
          {{ notificationQueue[0].message }}
        </v-col>
        <v-col class="shrink align-self-center">
          <v-icon
            v-if="notificationQueue[0].timeout === 0"
            right
            @click="finishNotification"
          >
            close
          </v-icon>
        </v-col>
      </v-row>
    </v-snackbar>
    <!-- Footer -->
    <v-bottom-navigation
      v-if="isFooterVisible"
      v-model="selectedNav"
      class="bottom-nav"
      app
    >
      <v-btn text value="home" to="/home">
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn text value="planner" @click="routeToMode()">
        <span>Planner</span>
        <v-icon>commute</v-icon>
      </v-btn>
      <v-btn text value="saved" to="/tripsOverviewPage">
        <span>Ritten</span>
        <v-icon>favorite</v-icon>
      </v-btn>
      <v-btn text value="community" to="/community">
        <span>Community</span>
        <v-icon>chat</v-icon>
      </v-btn>
      <v-btn text value="profile" to="/profile">
        <span>Profiel</span>
        <v-icon>person</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import constants from '@/constants/constants'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as NetmobielApp from '@/utils/NetmobielApp'

export default {
  name: 'App',
  components: { RoundUserImage },
  data: () => ({
    offsetTop: 0,
  }),
  computed: {
    profileImage() {
      return this.myProfile?.image
    },
    selectedNav: {
      get() {
        return uiStore.getters.getSelectedNav
      },
      set(value) {
        uiStore.mutations.setSelectedNav(value)
      },
    },
    isHeaderVisible() {
      return uiStore.getters.isHeaderVisible
    },
    isFooterVisible() {
      return uiStore.getters.isFooterVisible
    },
    notificationQueue() {
      return uiStore.getters.getNotificationQueue
    },
    notificationColor() {
      const queue = this.notificationQueue
      return queue.length && !queue[0].timeout ? 'error' : 'inform'
    },
    isNotificationBarVisible() {
      return uiStore.getters.isNotificationBarVisible
    },
    myProfile() {
      return psStore.getters.getProfile
    },
    deviceFcmToken() {
      return psStore.getters.getDeviceFcmToken
    },
    isBackButtonVisible() {
      return uiStore.getters.isBackButtonVisible
    },
    isProfileManaged() {
      return !!psStore.getters.getProfile?.id
    },
    surveyInteraction() {
      return psStore.getters.getSurveyInteraction
    },
  },
  watch: {
    deviceFcmToken() {
      // Only update if profile is (already) available
      // Otherwise save it once registered
      // console.log(`FCM token is: ${this.deviceFcmToken}`)
      if (this.myProfile?.id) {
        // Just in case the FCM token arrives after fetching the profile
        psStore.actions.storeMyFcmToken()
      }
    },
    myProfile(newProfile, oldProfile) {
      // console.log(`Profile: ${oldProfile?.id} --> ${newProfile?.id}`)
      if (newProfile?.id) {
        if (oldProfile?.id !== newProfile.id) {
          // A fresh profile has arrived
          // The profile is present. By now the FCM token should also have arrived.
          psStore.actions.storeMyFcmToken()
          psStore.mutations.setSurveyInteraction(null)
          psStore.actions.createSurveyInvitation()
        }
        if (!this.isProfileComplete(newProfile)) {
          let update = constants.COMPLETE_PROFILE_UPDATE
          uiStore.actions.addUpdate(update)
        }
      }
    },
    surveyInteraction(newSurvey, oldSurvey) {
      if (newSurvey?.survey && !newSurvey?.submitTime) {
        // console.log(
        //   `New survey ${newSurvey.urn} ${newSurvey.survey.surveyId} is detected`
        // )
        // Make a deep copy
        let updateMsg = JSON.parse(
          JSON.stringify(constants.COMPLETE_SURVEY_UPDATE)
        )
        updateMsg.id = newSurvey.urn
        updateMsg.link.href = newSurvey.surveyUrl
        updateMsg.link.notification = () =>
          psStore.actions.markSurveyRedirection(newSurvey.urn)
        uiStore.mutations.pushUpdate(updateMsg)
      }
      if (oldSurvey?.survey) {
        // console.log(
        //   `Old survey ${oldSurvey.urn} ${oldSurvey.survey.surveyId} is now gone`
        // )
        uiStore.mutations.removeUpdateById(oldSurvey.urn)
      }
    },
    // Log all route changes
    // $route(to, from) {
    //   console.log('Route changed from ' + from.path + ' to ' + to.path)
    // },
  },
  mounted() {
    // The initial message, if any, is passed by a query parameter to the url of the landing page
    window.addEventListener('NetmobielPushMessage', this.onPushMessageReceived)
    // Set the fcm token (for push notifications) in the local storage,
    // so we can retrieve it later to update the profile. Local storage is needed because
    // When a session expires or when returning from an external source no FCM token will be on the url
    if (typeof this.$route.query.fcm === 'string') {
      if (this.$route.query.fcm) {
        localStorage.setItem('fcm', this.$route.query.fcm)
      } else {
        localStorage.removeItem('fcm')
      }
    }
    if (this.$keycloak.authenticated) {
      psStore.mutations.setUserToken(this.$keycloak.token)
      window.addEventListener('NetmobielFcmToken', this.onFcmTokenReceived)
      // The FCM token is received before or after receiving the profile (if any), and also when still registering
      // The FCM token will be stored in the following situations:
      // 1. When receiving the updated FCM token
      // 2. When receiving the profile
      // 3. When creating the profile
      // If no FCM token is received the token value stays null and that value is stored in the profile.
      // console.log(`Request FCM token`)
      // Fetch the FCM token via message channel (since jan 2022 app)
      if (!NetmobielApp.requestFcmToken()) {
        // Message channel does not seem to be supported.
        // Fetch the FCM token from the localstorage (app version mid 2021) - for backward compatibility
        if (localStorage.fcm) {
          psStore.mutations.setDeviceFcmToken(localStorage.fcm)
        }
      } else {
        localStorage.removeItem('fcm')
      }
      // Only fetch profile of authenticated user
      // Fetch the profile, just in case the user is returning from an external page
      // It will cause duplicate calls to profile/me/status and profile/me when immediately navigating to the home page
      psStore.actions
        .fetchMyProfileStatus()
        .then(() => psStore.actions.fetchMyProfile())
        // Ignore the errors, they are resolved elsewhere.
        .catch(() => {})
    }
  },
  beforeDestroy() {
    window.removeEventListener('NetmobielFcmToken', this.onFcmTokenReceived)
    window.removeEventListener(
      'NetmobielPushMessage',
      this.onPushMessageReceived
    )
  },
  methods: {
    onPushMessageReceived(evt) {
      const detail = evt.detail
      // console.log(
      //   `Message received: ${detail.msgId} ${detail.title} ${detail.body}`
      // )
      if (detail.body) {
        const textMessage = [detail.title || '', detail.body]
          .filter((elem) => elem)
          .join(': ')
        uiStore.actions.queueInfoNotification(textMessage)
      }
    },
    onFcmTokenReceived(evt) {
      // Store the FCM token in the store, because at registration time, there is no profile yet
      const fcmToken = evt.detail?.fcmToken
      // console.log(`FCM received: ${this.fcmToken}`)
      psStore.mutations.setDeviceFcmToken(fcmToken)
    },
    onProfileImageClick() {
      // TODO: Only navigate to delegate if role is delegate (route to profile otherwise)
      const route = '/profile/delegate'
      // Do not route when we are already on the page.
      // (vue router will throw a NavigationDuplicated error)
      if (this.$route.path !== route) {
        this.$router.push(route)
      }
    },
    finishNotification() {
      uiStore.actions.finishNotification()
    },
    goBack() {
      this.$router.go(-1)
    },
    routeToMode() {
      let newRoute = ''
      if (this.myProfile.userRole === constants.PROFILE_ROLE_PASSENGER) {
        newRoute = '/search'
      } else if (this.myProfile.userRole === constants.PROFILE_ROLE_DRIVER) {
        newRoute = '/plan'
      } else {
        newRoute = '/modeSelection'
      }
      // We cannot route to the same page.
      if (this.$router.currentRoute.path !== newRoute) {
        this.$router.push(newRoute)
      }
    },
    isProfileComplete(profile) {
      return !!profile.dateOfBirth
    },
  },
}
</script>

<style lang="scss">
.v-main {
  overflow: hidden;
  // Set the height of the main section.
  // Vuetify applies automatically the padding for header and footer
  height: 100vh;
}
.homepage {
  background-image: url('assets/achterhoek_background.jpg');
  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
}

.homepage #content {
  margin-top: 30vmin;
  border-radius: $border-radius $border-radius 0 0;
  transition: all 250ms linear;
  -webkit-transition: all 250ms linear;
  -moz-transition: all 250ms linear;
  -o-transition: all 250ms linear;
}

.small #content {
  margin-top: 0;
}

.modeSelectPage #content {
  background: transparent;
}

header {
  background-image: url('./assets/logo_header.png');
  background-size: 120px;
  background-repeat: no-repeat;
  background-position: center center;
}

.v-application .text-light-grey {
  color: $color-light-grey;
}

.v-application .underlined {
  text-decoration: underline;
}

.text-bold {
  font-weight: bold;
}

.v-application .v-snack {
  bottom: 52px;
  z-index: 5;
}

.bottom-nav {
  z-index: 5;
}

//HACK: Styling of the notification close button. Some should fix this.
.notification-close-button {
  border-color: rgba(255, 255, 255, 0.54) !important;
  border-radius: 4px !important;
}
.notification-close-button span.v-btn__content {
  color: white !important;
}
.v-bottom-navigation {
  align-items: center;
}
</style>
