<template>
  <v-row class="d-flex flex-column py-3">
    <v-col v-for="(item, index) of items" :key="index" class="py-0">
      <v-row no-gutters>
        <v-col cols="3" class="bold">{{ item.label }}</v-col>
        <v-col
          v-if="item.renderingComponent === 'RecurrenceViewer'"
          class="pl-3"
        >
          <recurrence-viewer :recurrence="item.value" />
        </v-col>
        <v-col v-else class="capitalize pl-3">{{ item.value }}</v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import RecurrenceViewer from '@/components/common/RecurrenceViewer.vue'

export default {
  name: 'ItinerarySummaryList',
  components: { RecurrenceViewer },
  props: {
    items: { type: Array, default: () => [] },
  },
}
</script>

<style scoped>
.bold {
  font-weight: 400;
}
.capitalize {
  text-transform: lowercase;
}
.capitalize::first-letter {
  text-transform: uppercase;
}
</style>
