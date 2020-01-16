<template>
  <content-pane>
    <v-layout column>
      <v-flex>
        <v-layout row pb-3>
          <v-flex>
            <router-link to="/onboardingPage">
              <v-img
                class="profileimage"
                :src="require('@/assets/profile_img.png')"
              />
            </router-link>
          </v-flex>
          <v-flex text-xs-right>
            <v-layout fill-height justify-end column>
              <v-flex shrink>
                <h2>
                  {{ timeOfDayGreeting }},<br />
                  {{ user.fullName }}
                </h2>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-divider class="mb-2"></v-divider>
      <v-flex mt-2>
        <p>
          Welkom bij Netmobiel, dé mobiliteitsapp van de Achterhoek en
          omstreken.
        </p>
      </v-flex>
      <v-flex v-if="rides.length == 0" my-3>
        <v-btn rounded block outlined color="blue" to="/howTo">
          Hoe werkt het?
        </v-btn>
      </v-flex>
      <v-flex v-if="updateMessages.length > 0">
        <v-layout column mb-3>
          <v-flex>
            <h2 class="text-primary-uppercase">Updates</h2>
          </v-flex>
          <v-flex>
            <update-card :update-message="updateMessages[0]"></update-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout column mb-3>
          <v-flex>
            <h2 class="text-primary-uppercase">Jouw activiteiten</h2>
          </v-flex>
          <v-flex v-for="(ride, index) in rides" :key="index" xs12>
            <ride-card class="my-2" :ride="ride"></ride-card>
          </v-flex>
          <v-flex v-if="rides.length === 0">
            Je hebt nog geen activiteiten gepland.
          </v-flex>
          <v-flex v-else mt-2>
            <v-btn
              large
              rounded
              block
              outlined
              color="primary"
              to="/tripsOverviewPage"
            >
              Bekijk alle activiteiten
            </v-btn>
          </v-flex>
          <v-flex v-if="rides.length === 0" mt-4>
            <v-btn
              large
              depressed
              color="button"
              rounded
              block
              to="/modeSelection"
            >
              Direct aan de slag!
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import RideCard from '@/components/rides/RideCard.vue'
import UpdateCard from '@/components/home/UpdateCard.vue'
import moment from 'moment'

export default {
  components: {
    ContentPane,
    RideCard,
    UpdateCard,
  },
  computed: {
    user() {
      return this.$store.getters['ps/getUser']
    },
    rides() {
      //HACK: Only display first 3 rides.
      return this.$store.getters['cs/getRides'].slice(0, 2)
    },
    timeOfDayGreeting() {
      let currentHour = moment().format('HH')

      if (currentHour < 12) {
        return 'Goedemorgen'
      } else if (currentHour < 18) {
        return 'Goedemiddag'
      } else {
        return 'Goedeavond'
      }
    },
    updateMessages() {
      return this.$store.getters['ui/getUpdateMessages']
    },
  },
  mounted() {
    this.$store.commit('ui/addAppClass', 'homepage')
    this.$store.dispatch('cs/fetchRides')
  },
}
</script>

<style lang="scss">
.negMarIcon {
  margin-bottom: -3px;
}

.profileimage {
  // margin-top: -100px;
  // position: absolute;
  height: 10vmax;
  width: 10vmax;
  // margin-left: -7.5vmax;
  // left: 50%;
  border-radius: 1000px;
  // margin-top: -10vmax;
  border: 2px solid white;
}
</style>
