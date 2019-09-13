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
    <v-layout column>
      <h5>Mijn geplande ritten</h5>
      <v-flex
        v-for="(ride, index) in rides"
        :key="index"
        my-1
        xs12
        class="travel-card"
      >
        <v-layout>
          <v-flex pa-3 xs11>
            <v-layout column>
              <v-flex>
                <v-layout>
                  <v-flex>
                    <h3>Vertrek</h3>
                    <span>{{ formatTime(ride.selectedTime) }}</span>
                  </v-flex>
                  <v-flex grow>
                    <v-layout shrink justify-end>
                      <v-flex>
                        Geen passagiers
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout column>
                  <v-flex pa-0>
                    <v-icon>fa-car</v-icon>
                  </v-flex>
                  <v-flex><div class="travel-line"></div></v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                {{ ride.from }} <br />
                {{ ride.to }}
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex d-flex>
            <v-layout justify-center align-center column>
              <v-flex shrink>
                <v-icon @click="openDetails()">keyboard_arrow_right</v-icon>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-btn round large block to="/search">
          Ik wil een reis zoeken!
        </v-btn>
      </v-flex>
      <v-flex xs12 md6>
        <v-btn round large block to="/plan">
          Ik wil een reis aanbieden!
        </v-btn>
      </v-flex>
      <v-flex xs12 md6>
        <v-btn round large block @click="addNotification">
          Snackbar tonen
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  computed: {
    user() {
      return this.$store.getters['ps/getUser']
    },
    rides() {
      return this.$store.getters['cs/getRides']
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
    formatTime: function(time) {
      return moment(time).format('HH:mm')
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
