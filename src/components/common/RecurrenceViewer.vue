<template>
  <v-row dense no-gutters>
    <v-col>
      {{ formattedRecurrence }}
      <table v-if="recurrence.unit == 'WEEK'">
        <tr>
          <td class="pr-1">Ma</td>
          <td class="pr-1">Di</td>
          <td class="pr-1">Wo</td>
          <td class="pr-1">Do</td>
          <td class="pr-1">Vr</td>
          <td class="pr-1">Za</td>
          <td>Zo</td>
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
