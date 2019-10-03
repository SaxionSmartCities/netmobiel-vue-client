<template>
  <v-layout>
    <v-flex pa-3>
      <!-- REMOVED XS11 CLASS FROM FLEX ABOVE FOR ALPHA RELEAES -->
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
          {{ ride.from.address.label }} <br />
          {{ ride.to.address.label }}
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
      return moment(time).format('HH:mm')
    },
  },
}
</script>

<style lang="scss"></style>
