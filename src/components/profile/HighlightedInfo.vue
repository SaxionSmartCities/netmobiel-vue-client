<template>
  <v-card outlined>
    <v-card-text class="py-1">
      <v-row>
        <v-col v-for="(item, index) in items" :key="index">
          <v-row dense>
            <v-col class="text-color-primary total">
              {{ item.total }}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="subtitle-1">
              {{ item.description }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'HighlightedInfo',
  props: {
    ridesDriven: { type: Number, required: false, default: 0 },
    complimentsReceived: { type: Number, required: false, default: 0 },
    creditsDonated: { type: Number, required: false, default: 0 },
  },
  computed: {
    items() {
      return [
        { total: this.ridesDriven, description: 'Ritten gereden' },
        {
          total: this.complimentsReceived,
          description: 'Complimenten gekregen',
        },
        { total: this.creditsDonated, description: 'Credits gedoneerd' },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.total {
  font-size: 2em;
  font-weight: 600;
}
</style>
