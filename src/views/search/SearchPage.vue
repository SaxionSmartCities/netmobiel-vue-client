<template>
  <v-container
    align-center
    justify-center
    fill-height
    fluid
    grid-list-lg
    class="background-primary"
  >
    <v-layout justify-center align-center>
      <v-flex xs11 sm9 md6>
        <v-layout column shrink>
          <v-flex class="box-widget background-white">
            <v-form>
              <v-layout>
                <v-flex text-xs-center xs12>
                  <h1>Waar wil je heen?</h1>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex id="vannaar" xs11>
                  <v-layout column>
                    <v-flex id="van">
                      <v-layout row>
                        <v-flex xs3 sm2>
                          <v-subheader class="font-weight-bold">
                            Van
                          </v-subheader>
                        </v-flex>
                        <v-flex>
                          <p class="ma-0 mt-3">{{ fromLocation }}</p>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex id="naar">
                      <v-layout row>
                        <v-flex xs3 sm2>
                          <v-subheader class="font-weight-bold">
                            Naar
                          </v-subheader>
                        </v-flex>
                        <v-flex>
                          <p class="ma-0 mt-3">{{ toLocation }}</p>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex d-flex>
                  <v-layout column justify-center>
                    <v-flex
                      id="heenweericoon"
                      text-xs-center
                      justify-center
                      shrink
                      @click="swapLocations()"
                    >
                      <v-icon>import_export</v-icon>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex id="aankomsttijd" xs11>
                  <v-layout row>
                    <v-flex xs4 sm2>
                      <v-subheader class="font-weight-bold">
                        Aankomst
                      </v-subheader>
                    </v-flex>
                    <v-flex>
                      <p
                        v-if="dateRide === undefined"
                        class="ma-0 mt-3"
                        @click="toSearchRideDate"
                      >
                        Kies uw aankomst tijd
                      </p>
                      <p v-else class="ma-0 mt-3" @click="toSearchRideDate">
                        {{ dateRide }}
                      </p>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex mt-2>
                  <v-btn large round block to="/searchResults">
                    Plan je reis!
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout mt-2 justify-center>
                <v-flex shrink @click="toRidePreferences">
                  <v-icon>settings</v-icon>
                  <span class="ml-1">Reisvoorkeuren</span>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  data: function() {
    return {
      fromLocation: 'Enschede',
      toLocation: 'Deventer',
      dateRide: undefined,
    }
  },
  created() {
    var date = this.$store.getters.getSearchRideDate
    if (date !== undefined) {
      var formattedDate = moment(date)
        .format('dddd, DD MMMM HH:mm')
        .locale('nl')
      this.dateRide = formattedDate
    }
  },
  methods: {
    toRidePreferences() {
      this.$router.push({ name: 'ridePreferences' })
    },
    toSearchRideDate() {
      this.$router.push({ name: 'searchRideDate' })
    },
    swapLocations() {
      var tempLocation = this.fromLocation

      this.fromLocation = this.toLocation
      this.toLocation = tempLocation
    },
  },
}
</script>

<style lang="scss"></style>
