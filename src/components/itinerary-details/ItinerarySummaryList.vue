/* Show a list of name value pairs in a table-like markup. */
<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-col v-for="(item, index) of items" :key="index">
      <v-row no-gutters>
        <v-col cols="4" class="bold">{{ item.label }}</v-col>
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
        <v-col v-else-if="item.renderingComponent === 'CarViewer'" class="pl-3">
          <car-viewer :selected-car="item.value" />
        </v-col>
        <v-col
          v-else-if="item.renderingComponent === 'CallToAction'"
          class="pl-3"
        >
          <call-to-action :cta="item.value" />
        </v-col>
        <v-col
          v-else-if="item.renderingComponent === 'ImageViewer'"
          class="pl-3"
        >
          <image-viewer :path="item.value" />
        </v-col>
        <v-col
          v-else-if="item.renderingComponent === 'SustainabilityViewer'"
          class="pl-3"
        >
          <sustainability-viewer :itinerary="item.value" />
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
import CarViewer from '@/components/common/CarViewer.vue'
import CallToAction from '@/components/common/CallToAction.vue'
import ImageViewer from '@/components/common/ImageViewer'
import SustainabilityViewer from '@/components/common/SustainabilityViewer.vue'

export default {
  name: 'ItinerarySummaryList',
  components: {
    SustainabilityViewer,
    CallToAction,
    BookingList,
    RecurrenceViewer,
    CarViewer,
    ImageViewer,
  },
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
