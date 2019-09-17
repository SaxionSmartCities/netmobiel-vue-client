<template>
  <v-container grid-list-lg>
    <v-layout>
      <v-flex text-xs-center xs12>
        <h3>
          Hoi {{ user.givenName }} ({{ user.familyName }}, {{ user.email }})
        </h3>
        <p>Welkom bij Netmobiel!</p>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-btn round large block to="/search">
          Ik wil een reis zoeken!
        </v-btn>
      </v-flex>
      <v-flex xs12 md6>
        <v-btn round large block>
          Ik wil een reis aanbieden!
        </v-btn>
      </v-flex>
      <v-flex xs12 md6>
        <v-btn round large block @click="addNotification">
          Snackbar tonen
        </v-btn>
      </v-flex>
      <v-flex xs12 md6>
        <v-btn round large block :disabled="!user.profile.fcmToken" @click="sendPushNotification">
          Stuur mij push notificatie
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters['ps/getUser']
    },
  },
  methods: {
    addNotification: function() {
      this.$store.dispatch('ui/queueNotification', {
        message: 'This is a test1',
        timeout: 3000,
      })

      this.$store.dispatch('ui/queueNotification', {
        message: 'This is a test2',
        timeout: 3000,
      })

      this.$store.dispatch('ui/queueNotification', {
        message: 'This is a test3',
        timeout: 3000,
      })

      this.$store.dispatch('ui/queueNotification', {
        message: 'This is another test4',
        timeout: 0,
      })

      this.$store.dispatch('ui/queueNotification', {
        message: 'This is a test5',
        timeout: 3000,
      })

      this.$store.dispatch('ui/queueNotification', {
        message: 'This is another test6',
        timeout: 0,
      })
    },
    sendPushNotification: function() {
      console.log("Push it real good");
    },
  },
}
</script>

<style lang="scss">
.v-btn {
  text-transform: none;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: $color-orange;
  color: white;
}
</style>
