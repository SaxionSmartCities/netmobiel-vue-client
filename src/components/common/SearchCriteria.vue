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
        <span class="caption ml-1">{{
          planningRequest.arrivalTime
            ? formatDateTime(planningRequest.arrivalTime)
            : formatDateTime(planningRequest.departureTime)
        }}</span>
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
    formatDateTime(dateTime) {
      return moment(dateTime)
        .locale('nl')
        .calendar()
    },
  },
}
</script>

<style scoped></style>
