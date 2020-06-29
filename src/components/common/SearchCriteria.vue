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
        <span class="caption ml-1">
          {{ time(planningRequest).isArrival ? '(aankomst) ' : '(vertrek) ' }}
          {{ time(planningRequest).time }}
        </span>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'

export default {
  name: 'SearchCriteria',
  props: {
    planningRequest: { type: Object, required: true },
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
