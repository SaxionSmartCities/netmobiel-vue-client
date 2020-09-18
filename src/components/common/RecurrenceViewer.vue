<template>
  <v-row dense no-gutters>
    <v-col>
      {{ formattedRecurrence }}
      <table v-if="recurrence.unit == 'WEEK'" id="overview">
        <tr>
          <th>Ma</th>
          <th>Di</th>
          <th>Wo</th>
          <th>Do</th>
          <th>Vr</th>
          <th>Za</th>
          <th>Zo</th>
        </tr>
        <tr>
          <td v-for="day in [0, 1, 2, 3, 4, 5, 6]" :key="day">
            <v-icon>
              {{ recursOn(day) ? 'done' : '' }}
            </v-icon>
          </td>
        </tr>
      </table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'RecurrenceViewer',
  props: {
    recurrence: { type: Object, required: true },
  },
  computed: {
    formattedRecurrence() {
      const { unit, interval } = this.recurrence
      if (unit === 'DAY') {
        return 'Dagelijks'
      }
      return interval === 1 ? 'Wekelijks op:' : `Elke ${interval} weken op`
    },
  },
  methods: {
    recursOn(weekday) {
      return this.recurrence.daysOfWeekMask & (1 << weekday)
    },
  },
}
</script>

<style scoped>
#overview {
  width: 100%;
  margin-top: 4px;
  border-collapse: collapse;
}
#overview td,
#overview th {
  border: 1px solid #ddd;
  text-align: center;
}
#overview th {
  font-weight: 400;
  width: 13%;
}
#overview td {
  padding: 0 2px 4px 2px;
}
</style>
