<template>
  <v-row dense no-gutters>
    <v-col>
      <span v-if="recurrence.unit === 'DAY'">Dagelijks</span>
      <span v-else-if="recurrence.interval === 1">Wekelijks op:</span>
      <span v-else>Elke {{ recurrence.interval }} weken op</span>
      <table
        v-if="recurrence.unit === 'WEEK'"
        id="overview"
        role="table"
        aria-label="Herhaling in de week"
      >
        <tr role="rowheader">
          <th scope="col">Ma</th>
          <th scope="col">Di</th>
          <th scope="col">Wo</th>
          <th scope="col">Do</th>
          <th scope="col">Vr</th>
          <th scope="col">Za</th>
          <th scope="col">Zo</th>
        </tr>
        <tr role="row">
          <td v-for="day in [0, 1, 2, 3, 4, 5, 6]" :key="day" role="cell">
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
  methods: {
    recursOn(weekday) {
      return (this.recurrence.daysOfWeekMask & (1 << weekday)) !== 0
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
