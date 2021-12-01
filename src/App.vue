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
        <v-col class="shrink">
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
import hash from 'raw-loader!@/assets/current.hash'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

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
    currentNotification() {
      return uiStore.getters.getNotificationQueue[0]
    },
    myProfile() {
      return psStore.getters.getProfile
    },
    isBackButtonVisible() {
      return uiStore.getters.isBackButtonVisible
    },
    isProfileManaged() {
      return !!psStore.getters.getProfile?.id
    },
  },
  watch: {
    myProfile(newProfile) {
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
    // Log all route changes
    // $route(to, from) {
    //   console.log('Route changed from ' + from.path + ' to ' + to.path)
    // },
  },
  mounted() {
    // Set the fcm token (for push notifications) in the local storage
    // for so we can retrieve it later to update the profile.
    if (this.$route.query.fcm) {
      localStorage.fcm = this.$route.query.fcm
    }
    // Only fetch profile of authenticated user
    if (this.$keycloak.authenticated) {
      psStore.actions.fetchProfile().catch(() => {})
      psStore.mutations.setUserToken(this.$keycloak.token)
    }
  },
  methods: {
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
.version {
  font-style: italic;
  font-size: 0.6em;
  color: $color-white;
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

.v-snack {
  position: absolute;
  top: -52px;
}

.bottom-nav {
  z-index: 100 !important;
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
