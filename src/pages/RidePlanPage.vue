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
                  <h1>Waar rijd je heen?</h1>
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
                        <v-flex xs11 @click="toLocationSuggestionsPage('from')">
                          {{ fromLocationLabel }}
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex>
                      <v-layout my-1 row>
                        <v-flex pl-4 xs5 sm3>
                          <span class="form-label font-weight-bold">
                            Naar
                          </span>
                        </v-flex>
                        <v-flex xs11 @click="toLocationSuggestionsPage('to')">
                          {{ toLocationLabel }}
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
                        <v-flex xs11>
                          <input v-model="date" type="date" required />
                          <input v-model="time" type="time" required />
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex> </v-flex>
              </v-layout>
              <v-layout mt-2 justify-center text-xs-center>
                <v-flex>
                  <v-btn large round block @click="submitForm()">
                    Voeg reis toe!
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout mt-2 justify-center>
                <v-flex
                  shrink
                  transition="slide-x-transition"
                  @click="toRidePlanOptions()"
                >
                  <v-icon>settings</v-icon>
                  <span class="ml-1">Riteigenschappen</span>
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
  name: 'RidePlanPage',
  data: function() {
    return {
      date: moment()
        .locale('nl')
        .format('YYYY-MM-DD'),
      time: moment()
        .add(30, 'minutes')
        .locale('nl')
        .format('HH:mm'),
    }
  },
  computed: {
    fromLocationLabel() {
      let location = this.$store.getters['gs/getPickedLocation'].from

      return !location.address ? '' : location.address.label
    },
    toLocationLabel() {
      let location = this.$store.getters['gs/getPickedLocation'].to

      return !location.address ? '' : location.address.label
    },
  },
  methods: {
    swapLocations() {
      this.$store.commit('gs/swapLocations')
    },
    toLocationSuggestionsPage(field) {
      this.$router.push({ name: 'searchLocation', params: { field: field } })
    },
    toRidePlanOptions() {
      this.$router.push('/planOptions')
    },
    submitForm() {
      let pickedGeoLocations = this.$store.getters['gs/getPickedLocation']
      let from = pickedGeoLocations.from
      let to = pickedGeoLocations.to
      let ridePlanOptions = this.$store.getters['ps/getProfile'].ridePlanOptions
      let selectedTime = moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm')

      var rideDetails = {
        from: from,
        to: to,
        ridePlanOptions: ridePlanOptions,
        selectedTime: selectedTime,
      }

      console.log(rideDetails)
      this.$store.dispatch('cs/submitRide', rideDetails)
      this.$router.push('/planSubmitted')
    },
  },
}
</script>

<style lang="scss"></style>
