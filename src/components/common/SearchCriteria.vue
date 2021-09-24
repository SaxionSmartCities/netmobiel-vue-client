<template>
  <v-row dense class="d-flex flex-column">
    <v-col dense>
      <from-to-fields
        v-model="localCriteria"
        @fieldSelected="onFieldSelected"
        @swapLocations="onSwapLocations"
      />
    </v-col>
    <v-col class="py-0">
      <date-time-selector
        v-model="localTravelTime"
        @dateTimeChanged="onDateTimeChanged"
      />
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment'
import FromToFields from '@/components/common/FromToFields.vue'
import DateTimeSelector from '@/components/common/DateTimeSelector.vue'
import * as gsStore from '@/store/geocoder-service'

export default {
  name: 'SearchCriteria',
  components: { FromToFields, DateTimeSelector },
  props: {
    value: { type: Object, default: () => undefined },
  },
  computed: {
    localCriteria: {
      get() {
        return this.value
      },
      set(localCriteria) {
        this.$emit('criteriaChanged', localCriteria)
      },
    },
    localTravelTime() {
      if (this.value) {
        return this.value.travelTime
      }
      return undefined
    },
  },
  methods: {
    onFieldSelected(newField) {
      this.$emit('locationFieldSelected', newField)
    },
    onSwapLocations() {
      const { from, to } = this.value
      gsStore.mutations.swapLocations()
      this.localCriteria = {
        ...this.value,
        from: to,
        to: from,
      }
    },
    onDateTimeChanged(newDateTime) {
      this.localCriteria = {
        ...this.value,
        travelTime: newDateTime,
      }
    },
  },
}
</script>

<style lang="scss"></style>
