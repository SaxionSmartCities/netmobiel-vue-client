<template>
  <v-container id="app" fluid ma-0 pa-0>
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
import NetmobielHeader from '@/views/common/NetmobielHeader.vue'
import NetmobielFooter from '@/views/common/NetmobielFooter.vue'

export default {
  name: 'App',
  components: {
    NetmobielHeader,
    NetmobielFooter,
  },
  computed: {
    isHeaderVisible: function() {
      return this.$store.getters.isHeaderVisible
    },
    isFooterVisible: function() {
      return this.$store.getters.isFooterVisible
    },
    notificationQueue: function() {
      return this.$store.getters.getNotificationQueue
    },
    isNotificationBarVisible: function() {
      console.log(
        'should bar show?',
        this.$store.getters.isNotificationBarVisible
      )
      return this.$store.getters.isNotificationBarVisible
    },
    currentNotification: function() {
      return this.$store.getters.getNotificationQueue[0]
    },
  },
  methods: {
    finishNotification: function() {
      this.$store.dispatch('finishNotification')
    },
  },
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
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
