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
                  <v-layout column>
                    <v-flex text-xs-center>
                      <h1>Waar wil je heen?</h1>
                    </v-flex>
                    <v-flex>
                      <from-to-fields />
                    </v-flex>
                    <v-flex>
                      <v-layout column>
                        <v-flex xs11>
                          <v-layout>
                            <v-flex>
                              <v-dialog
                                v-model="dateModal"
                                persistent
                                width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="date"
                                    label="Datum"
                                    readonly
                                    prepend-icon="event"
                                    hide-details
                                    v-on="on"
                                  >
                                  </v-text-field>
                                </template>
                                <v-date-picker v-model="date" scrollable>
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    text
                                    color="primary"
                                    @click="dateModal = false"
                                  >
                                    Cancel
                                  </v-btn>
                                  <v-btn
                                    text
                                    color="primary"
                                    @click="
                                      saveDate(date)
                                      dateModal = false
                                    "
                                  >
                                    OK
                                  </v-btn>
                                </v-date-picker>
                              </v-dialog>
                            </v-flex>
                            <v-flex>
                              <v-dialog
                                ref="dialog"
                                v-model="timeModal"
                                :return-value.sync="time"
                                persistent
                                width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="time"
                                    label="Vertrektijd"
                                    prepend-icon="access_time"
                                    readonly
                                    hide-details
                                    v-on="on"
                                  >
                                  </v-text-field>
                                </template>
                                <v-time-picker
                                  v-if="timeModal"
                                  v-model="time"
                                  full-width
                                >
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    text
                                    color="primary"
                                    @click="timeModal = false"
                                  >
                                    Cancel
                                  </v-btn>
                                  <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.dialog.save(time)"
                                  >
                                    OK
                                  </v-btn>
                                </v-time-picker>
                              </v-dialog>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex>
                      <v-btn
                        large
                        rounded
                        block
                        color="secondary"
                        :disabled="!locationsPickedCheck"
                        @click="submitForm()"
                      >
                        Plan je reis!
                      </v-btn>
                    </v-flex>
                    <v-flex v-if="getSubmitStatus.status === 'FAILED'">
                      <v-expand-transition>
                        <v-flex>
                          <v-alert :value="true" type="error" color="red">
                            {{ getSubmitStatus.message }}
                          </v-alert>
                        </v-flex>
                      </v-expand-transition>
                    </v-flex>
                    <v-flex
                      body-2
                      my-1
                      transition="slide-x-transition"
                      @click="toRidePreferences"
                    >
                      <v-layout justify-center>
                        <v-flex shrink>
                          <v-icon>settings</v-icon>
                          <span class="ml-1">Reisvoorkeuren</span>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-flex>
            </v-expand-transition>
            <v-expand-transition>
              <v-flex v-if="getSubmitStatus.status !== 'UNSUBMITTED'">
                <v-expand-transition>
                  <v-flex
                    v-if="
                      getSubmitStatus.status === 'PENDING' ||
                        getSubmitStatus.status === 'SUCCESS'
                    "
                    shrink
                  >
                    <v-layout>
                      <v-flex xs-3 mt-2>
                        <v-progress-circular
                          indeterminate
                          :class="{
                            makeBlue: getSubmitStatus.status === 'PENDING',
                            rotate: getSubmitStatus.status === 'SUCCESS',
                          }"
                        >
                        </v-progress-circular>
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
import FromToFields from '@/components/common/FromToFields.vue'
import moment from 'moment'

export default {
  components: {
    FromToFields,
  },
  data: function() {
    return {
      pickedLocationState: 'NOTHING',
      showPicklocation: false,
      waiting: null,
      locationsPicked: false,
      selectedMode: 0,
      dateModal: false,
      timeModal: false,
      tmp: '',
    }
  },
  computed: {
    date: {
      get: function() {
        return this.$store.getters['ui/getTempValue']('searchDate')
      },
      set: function(value) {
        this.$store.commit('ui/setTempValue', { searchDate: value })
      },
    },
    time: {
      get: function() {
        return this.$store.getters['ui/getTempValue']('searchTime')
      },
      set: function(value) {
        this.$store.commit('ui/setTempValue', { searchTime: value })
      },
    },
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
    showPickLocationView(fieldPressed) {
      this.showPicklocation = true
      this.pickedLocationState = fieldPressed
    },
    saveDate(date) {
      this.date = date
    },
    toRidePreferences() {
      this.$router.push({ name: 'searchOptions' })
    },
    submitForm() {
      let pickedGeoLocations = this.$store.getters['gs/getPickedLocation']

      let from = pickedGeoLocations.from
      let to = pickedGeoLocations.to
      let searchPreferences = this.$store.getters['ps/getProfile']
        .searchPreferences
      let selectedTime = moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm')

      var searchQuery = {
        from: from,
        to: to,
        searchPreferences: searchPreferences,
        selectedTime: selectedTime,
      }

      this.$store.dispatch('is/submitPlanningsRequest', searchQuery)
    },
  },
}
</script>

<style scoped lang="scss">
.makeBlue {
  color: blue;
}
.rotate {
  color: #ff8500;
}
</style>
