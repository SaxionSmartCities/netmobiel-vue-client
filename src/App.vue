<template>
  <v-app id="app">
    <v-app-bar v-if="isHeaderVisible" flat app color="primary">
      <v-layout header fill-height align-center>
        <v-flex v-if="isBackButtonVisible" xs1 text-xs-center @click="goBack()">
          <v-icon id="backButton">arrow_back</v-icon>
        </v-flex>
      </v-layout>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-bottom-navigation v-if="isFooterVisible" v-model="selectedNav" app>
      <v-btn text value="home" to="/home">
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>

      <v-btn text value="planner" to="/modeSelection">
        <span>Planner</span>
        <v-icon>commute</v-icon>
      </v-btn>

      <v-btn text value="saved" to="/tripsOverviewPage">
        <span>Bewaard</span>
        <v-icon>favorite</v-icon>
      </v-btn>

      <v-btn text value="community" disabled>
        <span>Community</span>
        <v-icon>chat</v-icon>
      </v-btn>

      <v-btn text value="profile" to="/profile">
        <span>Profiel</span>
        <v-icon>person</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
  <!-- <v-container id="app" :class="appClasses" fluid ma-0 pa-0>
    <v-layout fill-height column>
      <v-flex v-if="isHeaderVisible" id="header" xs1>
        <netmobiel-header />
      </v-flex>
      <v-flex
        id="content"
        v-scroll:#content="onScroll"
        :class="{ footerPadding: isFooterVisible }"
        fill-height
        scroll-y
      >
        <router-view></router-view>
      </v-flex>

      <v-flex>
        <v-snackbar
          v-if="isNotificationBarVisible"
          v-model="isNotificationBarVisible"
          :timeout="0"
        >
          {{ notificationQueue[0].message }}
          <v-btn
            v-if="notificationQueue[0].timeout === 0"
            text
            @click="finishNotification"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-flex>

      <v-flex v-if="isFooterVisible" id="footer">
        <netmobiel-footer />
      </v-flex>
    </v-layout>
  </v-container> -->
</template>

<script>
// import NetmobielHeader from '@/components/common/NetmobielHeader.vue'
// import NetmobielFooter from '@/components/common/NetmobielFooter.vue'

export default {
  name: 'App',
  components: {
    // NetmobielHeader,
    // NetmobielFooter,
  },
  data: () => ({
    offsetTop: 0,
  }),
  computed: {
    appClasses: function() {
      return this.$store.getters['ui/getAppClasses']
    },
    selectedNav: {
      get: function() {
        return this.$store.getters['ui/getSelectedNav']
      },
      set: function(value) {
        this.$store.commit('ui/setSelectedNav', value)
      },
    },
    isHeaderVisible: function() {
      return this.$store.getters['ui/isHeaderVisible']
    },
    isFooterVisible: function() {
      return this.$store.getters['ui/isFooterVisible']
    },
    notificationQueue: function() {
      return this.$store.getters['ui/getNotificationQueue']
    },
    isNotificationBarVisible: function() {
      return this.$store.getters['ui/isNotificationBarVisible']
    },
    currentNotification: function() {
      return this.$store.getters['ui/getNotificationQueue'][0]
    },
    getProfile() {
      return this.$store.getters['ps/getProfile']
    },
    isBackButtonVisible: function() {
      return this.$store.getters['ui/isBackButtonVisible']
    },
  },
  watch: {
    getProfile(newProfile) {
      // Update profile if the passed FCM token is different compared
      // to the one in the profile.
      let passedFcmToken = localStorage.fcm
      if (passedFcmToken && passedFcmToken !== newProfile.fcmToken) {
        this.$store.dispatch('ps/storeFcmToken', { fcmToken: passedFcmToken })
      }
    },
  },
  mounted() {
    if (this.$route.query.fcm) {
      localStorage.fcm = this.$route.query.fcm
    }
    // Only fetch profile of user has been authenticated
    if (this.$keycloak.authenticated) {
      this.$store.dispatch('ps/fetchProfile')
    }
  },
  methods: {
    finishNotification: function() {
      this.$store.dispatch('ui/finishNotification')
    },
    onScroll(e) {
      this.offsetTop = e.target.scrollTop
      if (this.offsetTop > 30) {
        if (this.appClasses.slice(-1)[0] !== 'small') {
          this.$store.commit('ui/addAppClass', 'small')
        }
      } else {
        this.$store.commit('ui/removeAppClass', 'small')
      }
    },
    goBack: function() {
      this.$router.go(-1)
    },
    routeToMode: function() {
      // TODO: Link this to profile so we know where to route!
      this.$router.push('/modeSelection')
    },
  },
}
</script>

<style lang="scss">
@import '@/scss/styling.scss';

.homepage {
  background-image: url('assets/achterhoek_background.jpg');
  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
  // overflow-y: visible;
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

.header {
  background-image: url('./assets/logo_header.png');
  background-size: 120px;
  background-repeat: no-repeat;
  background-position: center center;
}

#backButton {
  color: $color-white;
}

.v-application .text-light-grey {
  color: $color-light-grey;
}

.v-application .underlined {
  text-decoration: underline;
}
</style>
