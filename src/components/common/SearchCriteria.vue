<template>
  <v-row class="">
    <v-col class="py-0">
      <div>
        <v-icon small>my_location</v-icon>
        <span v-if="planningRequest.from" class="caption ml-1">
          {{ planningRequest.from.label }}
        </span>
        <v-btn
          v-if="enableEdit"
          small
          color="primary"
          icon
          class="mr-3"
          @click="$emit('change', 'from')"
        >
          <v-icon x-small>edit</v-icon>
        </v-btn>
      </div>
      <div>
        <v-icon small>location_on</v-icon>
        <span v-if="planningRequest.to" class="caption ml-1"
          >{{ planningRequest.to.label }}
        </span>
        <v-btn
          v-if="enableEdit"
          small
          color="primary"
          icon
          class="mr-3"
          @click="$emit('change', 'to')"
        >
          <v-icon x-small>edit</v-icon>
        </v-btn>
      </div>
      <div>
        <v-icon small>access_time</v-icon>
        <span class="caption">
          {{ time(planningRequest).isArrival ? '(aankomst) ' : '(vertrek) ' }}
          {{ time(planningRequest).time }}
        </span>
        <v-btn
          v-if="enableEdit"
          small
          color="primary"
          icon
          class="mr-3"
          @click="$emit('change', 'date-time ')"
        >
          <v-icon x-small>edit</v-icon>
        </v-btn>
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
import { TIMESTAMP_FORMAT } from '@/utils/datetime'

export default {
  name: 'SearchCriteria',
  components: { SearchOptionsSummaryCard },
  props: {
    planningRequest: { type: Object, required: true },
    enableEdit: { type: Boolean, required: false, default: false },
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
      return moment(dateTime, TIMESTAMP_FORMAT)
        .locale('nl')
        .calendar()
    },
  },
}
</script>

<style scoped></style>
