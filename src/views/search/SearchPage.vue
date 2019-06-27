<template>
  <div class="fill-height full-width pa-0">
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
                          <v-flex xs3 sm2>
                            <v-subheader class="font-weight-bold">
                              Van
                            </v-subheader>
                          </v-flex>
                          <v-flex>
                            <v-text-field
                              v-model="fromLocation"
                              readonly
                              @click="showPickLocationView('from')"
                            ></v-text-field>
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
                            <v-text-field
                              v-model="toLocation"
                              readonly
                              @click="showPickLocationView('to')"
                            ></v-text-field>
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
                        <v-text-field value="Morgen, 10.00 uur"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-layout mt-2 justify-center text-xs-center>
                  <v-flex v-if="getSubmitStatus.status === 'UNSUBMITTED'">
                    <v-btn large round block @click="submitForm()">
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
                    <span>Reisvoorkeuren</span>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container v-if="showPicklocation">
      <search-suggestion-input
        @pickedLocation="setPickedLocationField"
      ></search-suggestion-input>
    </v-container>
  </div>
</template>

<script>
import SearchSuggestionInput from '../common/SearchSuggestionInput'
export default {
  components: { SearchSuggestionInput },
  data: function() {
    return {
      pickedLocationState: 'NOTHING',
      showPicklocation: false,
      waiting: null,
      fromLocation: 'Enschede',
      toLocation: 'Deventer',
    }
  },
  computed: {
    getSubmitStatus() {
      return this.$store.getters.getPlanningStatus
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
  },
  methods: {
    showPickLocationView(fieldPressed) {
      this.showPicklocation = true
      this.pickedLocationState = fieldPressed
    },
    setPickedLocationField(location) {
      if (this.pickedLocationState === 'to') {
        this.toLocation = location.label
      } else if (this.pickedLocationState === 'from') {
        this.fromLocation = location.label
      }
      console.log(JSON.stringify(location, null, 2))
      this.showPicklocation = false
    },
    toRidePrefrences() {
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
    submitForm() {
      // var searchQuery = {
      //   fromPlace: {
      //     lat: 52.219382,
      //     lon: 6.888892,
      //   },
      //   toPlace: {
      //     lat: 52.003318,
      //     lon: 6.519264,
      //   },
      // }
      var searchQuery = {
        fromPlace: {
          lat: 52.219382,
          lon: 6.888892,
        },
        toPlace: {
          lat: 52.199433,
          lon: 6.635025,
        },
      }

      this.$store.dispatch('submitPlanningsRequest', searchQuery)
    },
  },
}
</script>

<style lang="scss"></style>
