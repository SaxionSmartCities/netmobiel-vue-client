<template>
  <content-pane class="background-primary">
    <v-row class="full-height justify-center align-center">
      <v-col>
        <v-expand-transition>
          <v-row>
            <v-col class="box-widget background-white">
              <v-form>
                <v-row dense>
                  <v-col>
                    <h1>Waar wil je heen?</h1>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <search-criteria />
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
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import SearchCriteria from '@/components/common/SearchCriteria.vue'

// import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'

export default {
  components: {
    ContentPane,
    SearchCriteria,
  },
  data() {
    return {
      journeyMoment: undefined,
      pickedLocationState: 'NOTHING',
      showPicklocation: false,
    }
  },
  computed: {
    disabledSubmit() {
      const { from, to } = this.$store.getters['gs/getPickedLocation']
      return (
        !from.title ||
        !to.title ||
        !this.journeyMoment ||
        this.journeyMoment.when < moment().add(1, 'hour')
      )
    },
  },
  watch: {
    journeyMoment(newValue) {
      // If the selected date is in the past
      if (moment(newValue?.when) < moment()) {
        this.$store.dispatch(
          'ui/queueNotification',
          {
            message: 'De geselecteerde tijd ligt in het verleden.',
            timeout: 3000,
          },
          { root: true }
        )
      }
    },
  },
  mounted() {
    // const preFilledTime = this.$store.getters['gs/getPreFilledTime']
    // if (preFilledTime) {
    //   this.journeyMoment = {
    //     when: preFilledTime.when,
    //     ...preFilledTime,
    //   }
    //   this.journeyMoment = {}
    //   this.$set(this .journeyMoment, 'when', preFilledTime.when)
    //   this.$set(this.journeyMoment, 'arrival', preFilledTime.arriving)
    //   const { from, to } = this.$store.getters['gs/getPickedLocation']
    //   console.log('from title and to title', from.title, to.title)
    // }
  },
  // beforeRouteEnter: beforeRouteEnter({
  //   journeyMoment: DateTimeSelector.restoreModel,
  // }),
  // beforeRouteLeave: beforeRouteLeave({
  //   journeyMoment: DateTimeSelector.saveModel,
  // }),
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
        preferences: searchPreferences,
        timestamp: this.journeyMoment,
      })
      this.$store.commit('gs/setPreFilledTime', this.journeyMoment)
      this.$router.push({ name: 'searchResults', editTrip: true })
    },
    allowedDates(v) {
      return moment(v) >= moment().startOf('day')
    },
  },
}
</script>

<style scoped lang="scss"></style>
