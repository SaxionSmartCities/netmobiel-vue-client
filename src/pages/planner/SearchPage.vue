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
                    <search-criteria
                      v-model="searchCriteria"
                      @criteriaChanged="onCriteriaChanged"
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
                    @click="toSearchPreferences"
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

export default {
  components: {
    ContentPane,
    SearchCriteria,
  },
  computed: {
    searchCriteria() {
      return this.$store.getters['is/getSearchCriteria']
    },
    disabledSubmit() {
      const { from, to, travelTime } = this.searchCriteria
      return !from?.label || !to?.label || travelTime?.when < moment()
    },
    topOfTheHour() {
      const now = moment()
      return now.minute() || now.second() || now.millisecond()
        ? now.add(1, 'hour').startOf('hour')
        : now.startOf('hour')
    },
  },
  mounted() {
    this.initialize()
  },
  methods: {
    initialize() {
      const { searchPreferences } = this.$store.getters['ps/getProfile']
      const { from, to } = this.$store.getters['gs/getPickedLocation']
      const { travelTime } = this.searchCriteria
      let newCriteria = {
        ...this.searchCriteria,
        preferences: searchPreferences,
      }
      //TODO: move mapping from geo location to geocode sevice.
      if (from.position) {
        newCriteria.from = {
          label: `${from.title} ${from.vicinity || ''}`,
          latitude: from.position[0],
          longitude: from.position[1],
        }
      }
      if (to.position) {
        newCriteria.to = {
          label: `${to.title} ${to.vicinity || ''}`,
          latitude: to.position[0],
          longitude: to.position[1],
        }
      }
      if (!travelTime) {
        // Set the default date and time to today and the next whole hour.
        newCriteria.travelTime = {
          when: this.topOfTheHour,
          arriving: true,
        }
      }
      this.$store.commit('is/setSearchCriteria', newCriteria)
    },
    onCriteriaChanged(newCriteria) {
      //TODO: Do the valid time check in the search criteria component.
      // If the selected date is in the past show an error.
      if (moment(newCriteria?.travelTime?.when) < moment()) {
        this.$store.dispatch(
          'ui/queueNotification',
          {
            message: 'De geselecteerde tijd ligt in het verleden.',
            timeout: 0,
          },
          { root: true }
        )
      }
    },
    toSearchPreferences() {
      this.$router.push({ name: 'searchOptions' })
    },
    submitForm() {
      const { from, to, travelTime, preferences } = this.searchCriteria
      this.$store.dispatch('is/submitPlanningsRequest', {
        from,
        to,
        preferences,
        timestamp: travelTime,
      })
      this.$router.push({ name: 'searchResults', editTrip: true })
    },
  },
}
</script>

<style scoped lang="scss"></style>
