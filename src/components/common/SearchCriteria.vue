<template>
  <v-row dense class="d-flex flex-column">
    <v-col dense>
      <from-to-fields />
    </v-col>
    <v-col class="py-0">
      <date-time-selector v-model="value" :allowed-dates="allowedDates" />
    </v-col>
  </v-row>
</template>
<script>
import FromToFields from '@/components/common/FromToFields.vue'
import DateTimeSelector from '@/components/common/DateTimeSelector.vue'

export default {
  name: 'SearchCriteria',
  components: {
    FromToFields,
    DateTimeSelector,
  },
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
    allowedDates: {
      type: Function,
      default: () => true,
    },
  },
}
</script>

<style lang="scss"></style>
