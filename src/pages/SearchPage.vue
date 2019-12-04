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
                      <date-time-selector
                        @dateValueUpdated="dateChanged"
                        @timeValueUpdated="timeChanged"
                        @modeValueUpdated="modeChanged"
                      />
                    </v-flex>
                    <v-flex>
                      <v-btn
                        large
                        rounded
                        block
                        color="button"
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
import DateTimeSelector from '@/components/common/DateTimeSelector.vue'
import moment from 'moment'

export default {
  components: {
    FromToFields,
    DateTimeSelector,
  },
  data: function() {
    return {
      pickedLocationState: 'NOTHING',
      showPicklocation: false,
      waiting: null,
      locationsPicked: false,
      selectedDate: undefined,
      selectedTime: undefined,
      selectedMode: undefined,
    }
  },
  computed: {
    locationsPickedCheck: function() {
      const fromLoc = this.$store.getters['gs/getPickedLocation'].from
      const toLoc = this.$store.getters['gs/getPickedLocation'].to

      return fromLoc.title !== undefined && toLoc.title !== undefined
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
    dateChanged(value) {
      this.selectedDate = value
    },
    timeChanged(value) {
      this.selectedTime = value
    },
    modeChanged(value) {
      this.selectedMode = value
    },
    toRidePreferences() {
      this.$router.push({ name: 'searchOptions' })
    },
    submitForm() {
      const { from, to } = this.$store.getters['gs/getPickedLocation']
      let searchPreferences = this.$store.getters['ps/getProfile']
        .searchPreferences

      let searchQuery = {
        from: from,
        to: to,
        searchPreferences: searchPreferences,
        selectedTime: moment(
          this.selectedDate + ' ' + this.selectedTime,
          'YYYY-MM-DDTHH:mm:ss'
        ),
        mode: this.selectedMode,
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
