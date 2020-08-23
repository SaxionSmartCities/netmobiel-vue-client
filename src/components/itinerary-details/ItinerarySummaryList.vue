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
        <v-col v-else class="capitalize pl-3">
          <template v-if="item.label !== 'Boekingen'">
            {{ item.value }}
          </template>
          <div v-else>
            <v-row justify="space-between" dense>
              <v-col class="py-0 shrink">
                {{ item.value }}
              </v-col>
              <v-col class="py-0 shrink">
                <v-btn
                  color="primary"
                  icon
                  @click="expandBookings = !expandBookings"
                >
                  <v-icon>
                    {{ !expandBookings ? 'expand_more' : 'expand_less' }}
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <ul v-if="expandBookings" class="body-2 dashed-list pl-4">
              <li v-for="booking in item.bookings" :key="booking.bookingRef">
                {{
                  booking.passenger.givenName +
                    ' ' +
                    booking.passenger.familyName
                }}
              </li>
            </ul>
          </div>
        </v-col>
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
  data() {
    return {
      expandBookings: false,
    }
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
