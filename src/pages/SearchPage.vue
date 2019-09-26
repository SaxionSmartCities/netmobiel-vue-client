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
            <v-expand-transition>
              <v-flex v-if="showForm">
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
                          <v-layout my-1 row>
                            <v-flex pl-4 xs5 sm3>
                              <span class="form-label font-weight-bold">
                                Van
                              </span>
                            </v-flex>
                            <v-flex
                              xs11
                              @click="toLocationSuggestionsPage('from')"
                            >
                              {{ fromLocationLabel() }}
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex id="naar">
                          <v-layout my-1 row>
                            <v-flex pl-4 xs5 sm3>
                              <span class="form-label font-weight-bold">
                                Naar
                              </span>
                            </v-flex>
                            <v-flex
                              xs11
                              @click="toLocationSuggestionsPage('to')"
                            >
                              {{ toLocationLabel() }}
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex d-flex>
                      <v-layout column justify-center @click="swapLocations()">
                        <v-flex
                          id="heenweericoon"
                          text-xs-center
                          justify-center
                          shrink
                        >
                          <v-icon>import_export</v-icon>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex xs11>
                      <v-layout column>
                        <v-flex id="aankomsttijd">
                          <v-layout my-2 row>
                            <v-flex pl-4 sm3>
                              <span class="form-label font-weight-bold">
                                Aankomst
                              </span>
                            </v-flex>
                            <v-flex xs11 @click="toSearchRideDate">
                              {{ dateRide }}
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex> </v-flex>
                  </v-layout>
                  <v-layout mt-2 justify-center text-xs-center>
                    <v-flex>
                      <v-btn
                        large
                        round
                        block
                        :disabled="!locationsPickedCheck"
                        @click="submitForm()"
                      >
                        Plan je reis!
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-expand-transition>
                      <v-flex v-if="getSubmitStatus.status === 'FAILED'">
                        <v-alert :value="true" type="error" color="red">
                          {{ getSubmitStatus.message }}
                        </v-alert>
                      </v-flex>
                    </v-expand-transition>
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
            </v-expand-transition>
            <v-expand-transition>
              <v-flex v-if="getSubmitStatus.status !== 'UNSUBMITTED'">
                <v-expand-transition>
                  <v-flex v-if="getSubmitStatus.status === 'PENDING'" shrink>
                    <v-layout>
                      <v-flex xs-3 mt-2>
                        <v-progress-circular indeterminate color="blue">
                        </v-progress-circular>
                      </v-flex>
                      <v-flex>
                        <h3>Zoekopdracht wordt verstuurd!</h3>
                        <p>Even geduld...</p>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-expand-transition>
                <v-expand-transition>
                  <v-flex v-if="getSubmitStatus.status === 'SUCCESS'" shrink>
                    <v-layout>
                      <v-flex xs-3 mt-2>
                        <v-progress-circular
                          indeterminate
                          rotate
                          color="#FF8500"
                        ></v-progress-circular>
                      </v-flex>
                      <v-flex>
                        <h3>Zoekopdracht is verstuurd!</h3>
                        <p>Even geduld...</p>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-expand-transition>
              </v-flex>
            </v-expand-transition>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import { upperCaseFirst } from '@/utils/Utils.js'

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
    locationsPickedCheck: function() {
      const fromLoc = this.$store.getters['gs/getPickedLocation'].from
      const toLoc = this.$store.getters['gs/getPickedLocation'].to

      return fromLoc.address !== undefined && toLoc.address !== undefined
    },
    showForm: function() {
      return (
        this.getSubmitStatus.status === 'UNSUBMITTED' ||
        this.getSubmitStatus.status === 'FAILED'
      )
    },
    dateRide: function() {
      let dateTime = this.$store.getters['is/getSearchRideDateTime']

      if (dateTime !== undefined) {
        return upperCaseFirst(
          moment(dateTime)
            .locale('nl')
            .format('dddd, DD MMMM HH:mm')
        )
      } else {
        this.$store.commit('is/setDate', moment())
        return upperCaseFirst(
          moment()
            .add(30, 'minutes')
            .locale('nl')
            .format('dddd, DD MMMM HH:mm')
        )
      }
    },
    getSubmitStatus() {
      return this.$store.getters['is/getPlanningStatus']
    },
  },
  watch: {
    getSubmitStatus(newValue) {
      if (newValue.status === 'SUCCESS') {
        this.waiting = setTimeout(() => {
          this.$store.commit('is/clearPlanningRequest')
          this.$router.push('/searchResults')
        }, 1500)
      }
    },
    getPickedLocation: {
      handler: function(newValue) {
        if (newValue.from !== undefined && newValue.to !== undefined) {
          this.locationsPicked = true
        }
      },
      deep: true,
    },
  },
  methods: {
    fromLocationLabel() {
      let location = this.$store.getters['gs/getPickedLocation'].from

      return !location.address
        ? 'Klik hier voor vertrekplek'
        : location.address.label
    },
    toLocationLabel() {
      let location = this.$store.getters['gs/getPickedLocation'].to

      return !location.address
        ? 'Klik hier voor bestemming'
        : location.address.label
    },
    getPickedLocation() {
      return this.$store.getters.getPickedLocation
    },
    showPickLocationView(fieldPressed) {
      this.showPicklocation = true
      this.pickedLocationState = fieldPressed
    },
    toRidePrefrences() {
      this.$router.push({ name: 'searchOptions' })
    },
    toSearchRideDate() {
      this.$router.push({ name: 'searchDateTime' })
    },
    toLocationSuggestionsPage(field) {
      this.$router.push({ name: 'searchLocation', params: { field: field } })
    },
    swapLocations() {
      this.$store.commit('gs/swapLocations')
    },
    submitForm() {
      let pickedGeoLocations = this.$store.getters['gs/getPickedLocation']

      let from = pickedGeoLocations.from
      let to = pickedGeoLocations.to
      let ridePreferences = this.$store.getters['ps/getUser'].ridePreferences
      let selectedTime = this.$store.getters['is/getSearchRideDateTime']

      console.log('submit form', from)

      var searchQuery = {
        from: from,
        to: to,
        ridePreferences: ridePreferences,
        selectedTime: selectedTime,
      }

      this.$store.dispatch('is/submitPlanningsRequest', searchQuery)
    },
  },
}
</script>

<style lang="scss"></style>
