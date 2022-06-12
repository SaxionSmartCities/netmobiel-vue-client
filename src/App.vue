<template>
  <v-app id="app">
    <!-- Header -->
    <v-app-bar v-if="isHeaderVisible" flat app color="primary">
      <v-btn v-if="isBackButtonVisible" icon @click="$router.go(-1)">
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
    <v-bottom-navigation v-if="isFooterVisible" v-model="selectedNav" app>
      <v-btn text value="home" to="/home">
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn text value="planner" :to="plannerRoute">
        <span>Planner</span>
        <v-icon>commute</v-icon>
      </v-btn>
      <v-btn text value="saved" to="/tripsOverviewPage">
        <span>Ritten</span>
        <v-icon>favorite</v-icon>
      </v-btn>
      <v-badge
        offset-x="3em"
        offset-y="1ex"
        overlap
        dot
        color="red"
        :value="hasUnreadMessages"
      >
        <v-btn text value="community" to="/community">
          <span>Community</span>
          <v-icon>chat</v-icon>
        </v-btn>
      </v-badge>
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
import config from '@/config/config'
import * as msStore from '@/store/message-service'
import { EventBus } from '@/utils/EventBus'
import {
  requestFcmToken,
  runningInsideFlutterApp2021,
} from '@/utils/NetmobielApp'
import * as csStore from '@/store/carpool-service'

const checkMessageStatusInterval = 1000 * 60 * 15 // msec
const flushSessionLogInterval = 1000 * 60 // msec

export default {
  name: 'App',
  components: { RoundUserImage },
  data: () => ({
    offsetTop: 0,
    messageStatusTimer: null,
    sessionLogFlushTimer: null,
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
      return msStore.getters.getDeviceFcmToken
    },
    isBackButtonVisible() {
      return uiStore.getters.isBackButtonVisible
    },
    isProfileManaged() {
      return !!psStore.getters.getProfile?.id
    },
    isPassengerOnly() {
      return this.myProfile.userRole === constants.PROFILE_ROLE_PASSENGER
    },
    isDriverOnly() {
      return this.myProfile.userRole === constants.PROFILE_ROLE_DRIVER
    },
    isDriver() {
      return (
        this.myProfile.userRole === constants.PROFILE_ROLE_DRIVER ||
        this.myProfile.userRole === constants.PROFILE_ROLE_BOTH
      )
    },
    ridePlanOptions() {
      return this.myProfile?.ridePlanOptions
    },
    plannerRoute() {
      let newRoute = ''
      if (this.isPassengerOnly) {
        newRoute = '/search'
      } else if (this.isDriverOnly) {
        newRoute = '/plan'
      } else {
        newRoute = '/modeSelection'
      }
      return newRoute
    },
    config() {
      return config
    },
    hasUnreadMessages() {
      return msStore.getters.getUser?.unreadMessageCount > 0
    },
  },
  watch: {
    deviceFcmToken() {
      // Only update if profile is (already) available
      // Otherwise save it once registered
      // console.log(`FCM token is: ${this.deviceFcmToken}`)
      if (this.myProfile?.id) {
        // Just in case the FCM token arrives after fetching the profile
        msStore.actions.storeMyFcmToken()
      }
    },
    myProfile(newProfile, oldProfile) {
      // console.log(`Profile: ${oldProfile?.id} --> ${newProfile?.id}`)
      if (newProfile?.id) {
        if (oldProfile?.id !== newProfile.id) {
          // A fresh profile has arrived
          // The profile is present. By now the FCM token should also have arrived.
          msStore.actions.storeMyFcmToken()
        }
      }
    },
    // Log all route changes
    // $route(to, from) {
    //   console.log('Route changed from ' + from.path + ' to ' + to.path)
    // },
  },
  created() {
    //eslint-disable-next-line
    console.log(
      `Netmobiel ${config.GIT_HASH} ${config.BUILD_TIME} UserAgent ${navigator.userAgent}`
    )
  },
  mounted() {
    // console.log(`App: Mounted`)
    // The initial message, if any, is passed by a query parameter to the url of the landing page
    window.addEventListener('NetmobielPushMessage', this.onPushMessageReceived)
    // Set the fcm token (for push notifications) in the local storage,
    // so we can retrieve it later to update the profile. Local storage is needed because
    // when a session expires or when returning from an external source no FCM token will be on the url
    if (this.$route.query.fcm && typeof this.$route.query.fcm === 'string') {
      localStorage.setItem('fcm', this.$route.query.fcm)
    } else if (!runningInsideFlutterApp2021()) {
      // This construction allows testing of the old-style parameter exchange and at the same time ensures
      // clearing old-stuff away.
      // Only the old app (version mid 2021) uses the local storage
      localStorage.removeItem('fcm')
    }
    if (this.$keycloak.authenticated) {
      psStore.mutations.setUserToken(this.$keycloak.token)
      // Fetch the FCM token from the localstorage (app version mid 2021) - for backward compatibility
      if (localStorage.fcm) {
        msStore.mutations.setDeviceFcmToken(localStorage.fcm)
      }
      window.addEventListener('NetmobielFcmToken', this.onFcmTokenReceived)
      // Fetch the FCM token via message channel (since jan 2022 app)
      // console.log(`Request FCM token`)
      requestFcmToken()
      // The FCM token is received before or after receiving the profile (if any), and also when still registering
      // The FCM token will be stored in the following situations:
      // 1. When receiving the updated FCM token
      // 2. When receiving the profile
      // 3. When creating the profile
      // If no FCM token is received the token value stays null and that value is stored in the profile.
      // Only fetch profile of authenticated user
      // Fetch the profile, just in case the user is returning from an external page
      // It will cause duplicate calls to profile/me/status and profile/me when immediately navigating to the home page
      psStore.actions
        .fetchMyProfileStatus()
        .then(() => psStore.actions.fetchMyProfile())
        .then(() => this.fetchMyCar())
        .catch(() => {
          // Ignore the errors, they are resolved elsewhere.
        })
      // Get the message status
      msStore.actions.fetchMyStatus()
      this.messageStatusTimer = setInterval(() => {
        msStore.actions.fetchMyStatus()
      }, checkMessageStatusInterval)
      this.sessionLogFlushTimer = setInterval(() => {
        if (this.$keycloak.authenticated) {
          psStore.actions.flushSessionLog()
        }
      }, flushSessionLogInterval)
    }
  },
  beforeDestroy() {
    window.removeEventListener('NetmobielFcmToken', this.onFcmTokenReceived)
    window.removeEventListener(
      'NetmobielPushMessage',
      this.onPushMessageReceived
    )
    if (this.messageStatusTimer) {
      clearInterval(this.messageStatusTimer)
      this.messageStatusTimer = null
    }
    if (this.sessionLogFlushTimer) {
      clearInterval(this.sessionLogFlushTimer)
      this.sessionLogFlushTimer = null
    }
  },
  methods: {
    onPushMessageReceived(evt) {
      const detail = evt.detail
      // console.log(
      //   `Message received: ${detail.msgId} ${detail.title} ${detail.body}`
      // )
      // Update message count
      msStore.actions.fetchMyStatus()
      // Send event to message list (if active)
      EventBus.$emit('message-received', detail)
      // Show the message, but only when not already busy with some conversation
      if (detail.body && this.$route.name !== 'conversation') {
        const textMessage = [detail.title || '', detail.body]
          .filter((elem) => elem)
          .join(': ')
        uiStore.actions.queueInfoNotification(textMessage)
      }
    },
    onFcmTokenReceived(evt) {
      // Store the FCM token in the store first, at registration time, there is no profile yet
      const fcmToken = evt.detail?.fcmToken
      // console.log(`FCM received: ${this.fcmToken}`)
      msStore.mutations.setDeviceFcmToken(fcmToken)
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
    isProfileComplete(profile) {
      return (
        profile.dateOfBirth != null && profile.dateOfBirth.trim().length > 0
      )
    },
    fetchMyCar() {
      if (this.isDriver && this.ridePlanOptions?.selectedCarRef) {
        return csStore.actions.fetchCar(this.ridePlanOptions?.selectedCarRef)
      } else {
        return Promise.resolve()
      }
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

.v-app-bar {
  background-image: url('./assets/logo_header.png');
  background-size: 120px;
  background-repeat: no-repeat;
  background-position: center center;
}

.v-application .v-snack {
  bottom: 52px;
  z-index: 5;
}

.v-bottom-navigation {
  align-items: center;
  z-index: 5;
}
</style>
