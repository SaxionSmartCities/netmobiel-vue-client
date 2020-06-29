<template>
  <v-row class="">
    <v-col class="py-0">
      <div>
        <v-icon small>my_location</v-icon>
        <span class="caption ml-1">{{ planningRequest.from.label }}</span>
      </div>
      <div>
        <v-icon small>location_on</v-icon>
        <span class="caption ml-1">{{ planningRequest.to.label }}</span>
      </div>
      <div>
        <v-icon small>access_time</v-icon>
        <span class="caption">
          {{ time(planningRequest).isArrival ? '(aankomst) ' : '(vertrek) ' }}
          {{ time(planningRequest).time }}
        </span>
      </div>
      <div>
        <v-icon v-if="!expandRidePrefs" small>
          expand_more
        </v-icon>
        <v-icon v-else small>
          expand_less
        </v-icon>
        <span class="caption ml-1" @click="expandRidePrefs = !expandRidePrefs"
          >Reisvoorkeuren</span
        >
        <div class="mx-1">
          <search-options-summary-card
            v-if="expandRidePrefs"
          ></search-options-summary-card>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import SearchOptionsSummaryCard from '@/components/search-results/SearchOptionsSummaryCard'

export default {
  name: 'SearchCriteria',
  components: { SearchOptionsSummaryCard },
  props: {
    planningRequest: { type: Object, required: true },
  },
  data() {
    return { expandRidePrefs: false }
  },
  methods: {
    time(planningRequest) {
      if (planningRequest.arrivalTime) {
        return {
          time: this.formatDateTime(planningRequest.arrivalTime),
          isArrival: true,
        }
      } else {
        return {
          time: this.formatDateTime(planningRequest.departureTime),
          isArrival: false,
        }
      }
    },
    formatDateTime(dateTime) {
      return moment(dateTime)
        .locale('nl')
        .calendar()
    },
  },
}
</script>

<style scoped></style>
