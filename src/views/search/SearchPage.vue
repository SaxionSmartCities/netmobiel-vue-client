<template>
  <v-container
    v-if="!showPicklocation"
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
                        <v-flex xs4 sm2>
                          <v-subheader class="font-weight-bold">
                            Van
                          </v-subheader>
                        </v-flex>
                        <v-flex>
                          <v-text-field
                            :value="fromLocationLabel"
                            @click="toLocationSuggestionsPage('from')"
                          >
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex id="naar">
                      <v-layout row>
                        <v-flex xs4 sm2>
                          <v-subheader class="font-weight-bold">
                            Naar
                          </v-subheader>
                        </v-flex>
                        <v-flex>
                          <v-text-field
                            readonly
                            :value="toLocationLabel"
                            @click="toLocationSuggestionsPage('to')"
                          >
                          </v-text-field>
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
                      <p class="ma-0 mt-3" @click="toSearchRideDate">
                        {{ dateRide }}
                      </p>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout mt-2 justify-center text-xs-center>
                <v-flex v-if="getSubmitStatus.status === 'UNSUBMITTED'">
                  <v-btn
                    :disabled="!locationsPicked"
                    large
                    round
                    block
                    @click="submitForm()"
                  >
                    Plan je reis!
                  </v-btn>
                </v-flex>
                <v-flex v-if="getSubmitStatus.status === 'FAILED'">
                  <v-alert :value="true" type="error" color="red">
                    {{ getSubmitStatus.message }}
                  </v-alert>
                </v-flex>
                <v-flex v-if="getSubmitStatus.status === 'SUCCESS'">
                  <v-alert :value="true" type="success" color="green">
                    Zoekopdracht verstuurd! <br />
                    Even geduld...
                  </v-alert>
                </v-flex>

                <v-flex v-if="getSubmitStatus.status === 'PENDING'" shrink>
                  <v-progress-circular indeterminate color="blue">
                  </v-progress-circular>
                </v-flex>
              </v-layout>
              <v-layout mt-2 justify-center>
                <v-flex
                  shrink
                  transition="slide-x-transition"
                  @click="toRidePrefrences"
                >
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
      pickedLocationState: 'NOTHING',
      showPicklocation: false,
      waiting: null,
      locationsPicked: false,
    }
  },
  computed: {
    dateRide: function() {
      let dateTime = this.$store.getters.getSearchRideDateTime

      if (dateTime !== undefined) {
        return moment(dateTime)
          .locale('nl')
          .format('dddd, DD MMMM HH:mm')
      } else {
        return moment()
          .locale('nl')
          .format('dddd, DD MMMM HH:mm')
      }
    },
  },
  methods: {
    getSubmitStatus() {
      return this.$store.getters.getPlanningStatus
    },
    fromLocationLabel() {
      let location = this.$store.getters.getFromLocation

      return !location.address ? 'UNDEFINED' : location.address.label // todo: remove UNDEFINED message
    },
    toLocationLabel() {
      let location = this.$store.getters.getToLocation

      return !location.address ? 'UNDEFINED' : location.address.label // todo: remove UNDEFINED message
    },
    getGeocoderPickedLocations() {
      return this.$store.getters.getGeocoderPickedLocations
    },
  },
  watch: {
    getSubmitStatus(newValue) {
      if (newValue.status === 'SUCCESS') {
        this.waiting = setTimeout(() => {
          this.$store.commit('clearPlanningRequest')
          this.$router.push('/searchResults')
        }, 1500)
      }
    },
    getGeocoderPickedLocations: {
      handler: function(newValue) {
        if (newValue.from !== undefined && newValue.to !== undefined) {
          this.locationsPicked = true
        }
      },
      deep: true,
    },
  },
  methods: {
    showPickLocationView(fieldPressed) {
      this.showPicklocation = true
      this.pickedLocationState = fieldPressed
    },
    toRidePrefrences() {
      this.$router.push({ name: 'ridePreferences' })
    },
    toSearchRideDate() {
      this.$router.push({ name: 'searchRideDate' })
    },
    toLocationSuggestionsPage(field) {
      this.$router.push({ name: 'searchLocation', params: { field: field } })
    },
    swapLocations() {
      var tempLocation = this.fromLocation

      this.fromLocation = this.toLocation
      this.toLocation = tempLocation
    },
    submitForm() {
      let pickedGeoLocations = this.$store.getters.getGeocoderPickedLocations
      let from = pickedGeoLocations.from
      let to = pickedGeoLocations.to

      var searchQuery = {
        fromPlace: {
          lat: from.displayPosition.latitude,
          lon: from.displayPosition.longitude,
        },
        toPlace: {
          lat: to.displayPosition.latitude,
          lon: to.displayPosition.longitude,
        },
      }

      this.$store.dispatch('submitPlanningsRequest', searchQuery)
    },
  },
}
</script>

<style lang="scss"></style>
