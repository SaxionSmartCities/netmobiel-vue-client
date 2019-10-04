<template>
  <v-layout travel-card pt-3 pb-3 pl-3 pr-1>
    <v-flex xs11>
      <v-layout column>
        <v-flex>
          <v-layout>
            <v-flex>
              <h4>Vertrek</h4>
              {{ parsedDepature }}
            </v-flex>
            <v-flex text-xs-right pr-1>
              <h4>Reizen met</h4>
              {{ driver.givenName }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex mt-3>
          <v-layout>
            <v-flex xs12>
              <v-layout column>
                <v-flex>
                  <v-layout>
                    <v-flex shrink>
                      <v-icon class="text-primary">local_taxi</v-icon>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex pt-1>
                  <div class="travel-line"></div>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex d-flex>
      <v-layout justify-center align-center column @click="openDetails()">
        <v-flex shrink>
          <v-icon>keyboard_arrow_right</v-icon>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'

export default {
  name: 'DirectRideCard',
  props: {
    from: { type: Object, required: true },
    to: { type: Object, required: true },
    date: { type: Number, required: true },
    ride: { type: Object, required: true },
  },
  computed: {
    driver: function() {
      if (this.ride.driver === undefined) {
        return {
          familyName: 'Achternaam',
          givenName: 'Voornaam',
        }
      } else {
        return this.ride.driver
      }
    },
    parsedDepature: function() {
      return moment(this.date)
        .locale('nl')
        .calendar()
    },
  },
  methods: {
    openDetails: function() {
      const selectedTrip = {
        from: this.from,
        to: this.from,
        date: this.date,
        ride: this.ride,
      }
      this.$store.commit('is/setSelectedTrip', selectedTrip)
      this.$router.push('/rideDetailPage')
    },
  },
}
</script>

<style lang="scss">
.travel-card {
  border-radius: 10px;
  border: 1px $color-light-grey solid;
}
</style>
