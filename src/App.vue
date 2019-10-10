<template>
  <v-container id="app" :class="appClasses" fluid ma-0 pa-0>
    <v-layout fill-height column>
      <v-flex v-if="isHeaderVisible" id="header" xs1>
        <netmobiel-header />
      </v-flex>

      <v-flex id="content" fill-height scroll>
        <router-view></router-view>
      </v-flex>

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

      <div v-if="isFooterVisible" id="footer">
        <netmobiel-footer />
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import NetmobielHeader from '@/components/common/NetmobielHeader.vue'
import NetmobielFooter from '@/components/common/NetmobielFooter.vue'

export default {
  name: 'App',
  components: {
    NetmobielHeader,
    NetmobielFooter,
  },
  computed: {
    appClasses: function() {
      return this.$store.getters['ui/getAppClasses']
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
  },
  watch: {
    getProfile(newProfile) {
      // Update profile if the passed FCM token is different compared
      // to the one in the profile.
      let passedFcmToken = this.$route.query.fcm
      if (passedFcmToken && passedFcmToken !== newProfile.fcmToken) {
        this.$store.dispatch('ps/storeFcmToken', { fcmToken: passedFcmToken })
      }
    },
  },
  mounted() {
    // Only fetch profile of user has been authenticated
    if (this.$keycloak.authenticated) {
      this.$store.dispatch('ps/fetchProfile')
    }
  },
  methods: {
    finishNotification: function() {
      this.$store.dispatch('ui/finishNotification')
    },
  },
}
</script>

<style lang="scss">
html,
body {
  background: $color-green;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

#content {
  background: white;
}
#app {
  height: 100vh;
}

#header {
  height: 10vmax;
}

#footer {
  height: 56px;
}

.scroll {
  overflow-y: scroll;
}
</style>
