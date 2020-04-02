<template>
  <content-pane class="background-primary">
    <v-row class="full-height justify-center align-center">
      <v-col cols="11">
        <v-expand-transition>
          <v-row>
            <v-col v-if="showForm" class="box-widget background-white">
              <v-form>
                <v-row dense>
                  <v-col>
                    <h2>Waar wil je heen?</h2>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <from-to-fields />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <date-time-selector
                      v-model="journeyMoment"
                      :allowed-dates="allowedDates"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn
                      large
                      rounded
                      block
                      depressed
                      color="button"
                      :disabled="disabledSubmit"
                      @click="submitForm()"
                    >
                      Plan je reis!
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    class="body-2 text-center"
                    transition="slide-x-transition"
                    @click="toRidePreferences"
                  >
                    <v-icon>settings</v-icon>
                    <span class="ml-1">Reisvoorkeuren</span>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-expand-transition>
        <v-expand-transition>
          <v-row
            v-if="
              getSubmitStatus.status === 'PENDING' ||
                getSubmitStatus.status === 'SUCCESS'
            "
          >
            <v-col class="box-widget background-white" shrink>
              <v-row>
                <v-col cols="3" xs-3 mt-2>
                  <v-progress-circular
                    indeterminate
                    :class="{
                      makeBlue: getSubmitStatus.status === 'PENDING',
                      rotate: getSubmitStatus.status === 'SUCCESS',
                    }"
                  >
                  </v-progress-circular>
                </v-col>
                <v-col>
                  <h3>Zoekopdracht is verstuurd!</h3>
                  <p>Even geduld...</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import FromToFields from '@/components/common/FromToFields.vue'
import DateTimeSelector from '@/components/common/DateTimeSelector.vue'

import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'

export default {
  components: {
    ContentPane,
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
      return (
        !from.title ||
        !to.title ||
        !this.journeyMoment ||
        this.journeyMoment.when < moment().add(1, 'hour')
      )
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
      return moment(v) >= moment().startOf('day')
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
