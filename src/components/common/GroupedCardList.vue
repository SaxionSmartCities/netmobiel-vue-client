<template>
  <v-row v-if="items && items.length > 0">
    <v-col>
      <section v-for="date in getDistinctDays" :key="date" class="px-0 pb-2">
        <h4 class="netmobiel pb-1">{{ formatToCategoryDate(date) }}</h4>
        <v-row
          v-for="(item, index) in getItemsForThatDay(date)"
          :key="index"
          dense
        >
          <v-col>
            <slot name="card" :item="item" :index="index"> </slot>
          </v-col>
        </v-row>
      </section>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'

export default {
  name: 'GroupedCardList',
  props: {
    items: { type: Array, required: true },
    getDate: { type: Function, required: true },
  },
  computed: {
    getDistinctDays() {
      let distinctDays = []
      this.items.forEach((item) => {
        const date = this.getDate(item)
        const calendarDate = moment(date).format('LL')
        if (!distinctDays.includes(calendarDate)) {
          distinctDays.push(calendarDate)
        }
      })
      return distinctDays
    },
  },
  methods: {
    getItemsForThatDay(sectionDay) {
      return this.items.filter((item) => {
        const dateToCheck = moment(this.getDate(item).valueOf())
        return (
          moment(sectionDay, 'LL').isSame(dateToCheck, 'day') &&
          moment(sectionDay, 'LL').isSame(dateToCheck, 'month')
        )
      })
    },
    formatToCategoryDate(date) {
      return moment(date, 'LL').locale('NL').format('dddd DD MMMM')
    },
  },
}
</script>

<style scoped></style>
