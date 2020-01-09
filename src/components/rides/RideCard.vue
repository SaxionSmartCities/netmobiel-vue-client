<template>
  <v-layout>
    <v-flex travel-card pa-3>
      <!-- REMOVED XS11 CLASS FROM FLEX ABOVE FOR ALPHA RELEAES -->
      <v-layout column>
        <v-flex>
          <v-layout>
            <v-flex>
              <h3>Vertrek</h3>
              <p class="first-letter-caps mb-0 font-weight-light">
                {{ formatTime(ride.departureTime) }}
              </p>
            </v-flex>
            <v-flex grow>
              <v-layout shrink justify-end>
                <v-flex class="align-right body-2 font-weight-light">
                  Geen passagiers
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout pt-2 column>
            <v-flex pa-0 pb-1>
              <v-icon>directions_car</v-icon>
            </v-flex>
            <v-flex><div class="travel-line"></div></v-flex>
            <v-flex mt-2 mb-2 body-2 font-weight-light>
              Naar {{ formatPlace(ride.toPlace.label) }}
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <!-- DISABLED FOR ALPHA RELEASE
    <v-flex d-flex>
      <v-layout justify-center align-center column>
        <v-flex shrink>
          <v-icon @click="openDetails()">keyboard_arrow_right</v-icon>
        </v-flex>
      </v-layout>
    </v-flex> -->
  </v-layout>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    ride: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatTime: function(time) {
      //HACK: Remove [UTC] from the date string for correct parseing.
      // Should be fixed in the backend.
      return moment(time.replace('[UTC]', ''))
        .locale('nl')
        .calendar()
    },
    //HACK: Very dangerous function. Can embarass you at a cocktail party.
    formatPlace(placeString) {
      return placeString.split(',')[0]
    },
  },
}
</script>

<style lang="scss">
.align-right {
  text-align: right;
}
.travel-card {
  border-radius: 10px;
  border: 1px $color-light-grey solid;
}
</style>
