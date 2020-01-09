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
                        v-model="journeyMoment"
                        :allowed-dates="allowedDates"
                      />
                    </v-flex>
                    <v-flex>
                      <v-btn
                        large
                        rounded
                        block
                        color="button"
                        :disabled="disabledSubmit"
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

import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'

export default {
  components: {
    FromToFields,
    DateTimeSelector,
  },
  data: function() {
    return {
      journeyMoment: undefined,
      pickedLocationState: 'NOTHING',
      showPicklocation: false,
    }
  },
  computed: {
    disabledSubmit: function() {
      const { from, to } = this.$store.getters['gs/getPickedLocation']
      return !from.title || !to.title || !this.journeyMoment
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
        this.$router.push('/searchResults')
        this.$store.commit('is/clearPlanningRequest')
      }
    },
  },
  beforeRouteEnter: beforeRouteEnter({
    journeyMoment: DateTimeSelector.restoreModel,
  }),
  beforeRouteLeave: beforeRouteLeave({
    journeyMoment: DateTimeSelector.saveModel,
  }),
  methods: {
    toRidePreferences() {
      this.$router.push({ name: 'searchOptions' })
    },
    submitForm() {
      const { from, to } = this.$store.getters['gs/getPickedLocation']
      const { searchPreferences } = this.$store.getters['ps/getProfile']
      this.$store.dispatch('is/submitPlanningsRequest', {
        from,
        to,
        searchPreferences,
        timestamp: this.journeyMoment,
      })
    },
    allowedDates(v) {
      return new Date(v) > new Date()
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
