<template>
  <v-app id="app">
    <!-- Header -->
    <v-app-bar v-if="isHeaderVisible" flat app color="primary">
      <v-btn v-if="isBackButtonVisible" icon @click="goBack()">
        <v-icon color="white">arrow_back</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <span class="version">{{ commithash }}</span>
    </v-app-bar>
    <!-- Content -->
    <v-main>
      <router-view></router-view>
      <v-snackbar
        v-if="isNotificationBarVisible"
        v-model="isNotificationBarVisible"
        :timeout="0"
        :color="notificationColor"
        bottom
        absolute
      >
        {{ notificationQueue[0].message }}
        <v-btn
          v-if="notificationQueue[0].timeout === 0"
          text
          outlined
          font-weight-medium
          class="notification-close-button"
          @click="finishNotification"
        >
          Sluiten
        </v-btn>
      </v-snackbar>
    </v-main>
    <!-- Footer -->
    <v-bottom-navigation v-if="isFooterVisible" v-model="selectedNav" app>
      <v-btn text value="home" to="/home">
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn text value="planner" @click="routeToMode()">
        <span>Planner</span>
        <v-icon>commute</v-icon>
      </v-btn>
      <v-btn text value="saved" to="/tripsOverviewPage">
        <span>Bewaard</span>
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
import constants from '@/constants/update-messages.js'
import hash from 'raw-loader!@/assets/current.hash'
import ybug from './config/ybug'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

export default {
  name: 'App',
  data: () => ({
    offsetTop: 0,
    commithash: hash,
  }),
  computed: {
    selectedNav: {
      get: function() {
        return uiStore.getters.getSelectedNav
      },
      set: function(value) {
        uiStore.mutations.setSelectedNav(value)
      },
    },
    isHeaderVisible: function() {
      return uiStore.getters.isHeaderVisible
    },
    isFooterVisible: function() {
      return uiStore.getters.isFooterVisible
    },
    notificationQueue: function() {
      return uiStore.getters.getNotificationQueue
    },
    notificationColor: function() {
      const queue = this.notificationQueue
      return queue.length && !queue[0].timeout ? 'error' : 'inform'
    },
    isNotificationBarVisible: function() {
      return uiStore.getters.isNotificationBarVisible
    },
    currentNotification: function() {
      return uiStore.getters.getNotificationQueue[0]
    },
    getProfile() {
      return psStore.getters.getProfile
    },
    isBackButtonVisible: function() {
      return uiStore.getters.isBackButtonVisible
    },
  },
  watch: {
    getProfile(newProfile) {
      if (!this.isProfileComplete(newProfile)) {
        let update = constants.COMPLETE_PROFILE_UPDATE
        uiStore.actions.addUpdate(update)
      }
      // Update profile if the passed FCM token is different compared
      // to the one in the profile.
      let passedFcmToken = localStorage.fcm
      if (passedFcmToken && passedFcmToken !== newProfile.fcmToken) {
        psStore.actions.storeFcmToken({ fcmToken: passedFcmToken })
      }
    },
  },
  mounted() {
    const user = { name: 'netmobiel' }
    ybug(user)
    // Set the fcm token (for push notifications) in the local storage
    // for so we can retrieve it later to update the profile.
    if (this.$route.query.fcm) {
      localStorage.fcm = this.$route.query.fcm
    }
    // Only fetch profile of user has been authenticated
    if (this.$keycloak.authenticated) {
      psStore.actions.fetchProfile()
      psStore.mutations.setUserToken(this.$keycloak.token)
    } else {
      this.$router.push({ name: 'landing' })
    }
  },
  methods: {
    finishNotification: function() {
      uiStore.actions.finishNotification()
    },
    goBack: function() {
      this.$router.go(-1)
    },
    routeToMode: function() {
      let newRoute = ''
      if (this.getProfile.userRole === 'passenger') {
        newRoute = '/search'
      } else if (this.getProfile.userRole === 'driver') {
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
      return (
        !!profile.dateOfBirth &&
        !!profile.interests &&
        profile.interests.length > 0
      )
    },
  },
}
</script>

<style lang="scss">
.version {
  font-style: italic;
  font-size: 0.6em;
  color: $color-white;
}

// .v-content {
//   height: 100vh;
//   overflow: hidden;
// }

.homepage {
  background-image: url('assets/achterhoek_background.jpg');
  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
}

.homepage #content {
  margin-top: 30vmin;
  border-radius: $border-radius $border-radius 0 0;
  -webkit-transition: all 250ms linear;
  -moz-transition: all 250ms linear;
  -o-transition: all 250ms linear;
}

.small #content {
  margin-top: 0px;
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
