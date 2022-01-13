/* Show a list of name value pairs in a table-like markup. */
<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-col v-for="(item, index) of items" :key="index">
      <v-row no-gutters>
        <v-col cols="3" class="bold">{{ item.label }}</v-col>
        <v-col
          v-if="item.renderingComponent === 'RecurrenceViewer'"
          class="pl-3"
        >
          <recurrence-viewer :recurrence="item.value" />
        </v-col>
        <v-col
          v-else-if="item.renderingComponent === 'BookingList'"
          class="pl-3"
        >
          <booking-list :booking-list="item.value" />
        </v-col>
        <v-col v-else class="pl-3">
          {{ item.value }}
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import BookingList from '@/components/common/BookingList.vue'
import RecurrenceViewer from '@/components/common/RecurrenceViewer.vue'

export default {
  name: 'ItinerarySummaryList',
  components: { BookingList, RecurrenceViewer },
  props: {
    items: { type: Array, default: () => [] },
  },
}
</script>

<style scoped>
.bold {
  font-weight: 400;
}
</style>
