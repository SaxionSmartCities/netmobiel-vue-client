<template>
  <v-card outlined :class="{ 'selected-car': isSelectedCar }">
    <v-card-title class="justify-space-between py-1">
      <span>{{ car.brand }} {{ car.model }}</span>
      <v-icon v-if="isSelectedCar">directions_car</v-icon>
    </v-card-title>
    <v-card-text class="py-1">
      <v-row dense no-gutters>
        <v-col cols="4">Kenteken:</v-col>
        <v-col>{{ car.licensePlate }}</v-col>
      </v-row>
      <v-row dense no-gutters>
        <v-col cols="4">Bouwjaar:</v-col>
        <v-col>{{ car.registrationYear }}</v-col>
      </v-row>
      <v-row dense no-gutters>
        <v-col cols="4">Kleur:</v-col>
        <v-col>{{ car.color }}</v-col>
      </v-row>
      <v-row dense no-gutters>
        <v-col cols="4"># Stoelen:</v-col>
        <v-col>{{ car.nrSeats }}</v-col>
      </v-row>
      <v-row v-if="car.co2Emission" dense no-gutters>
        <v-col cols="4">CO2 (gr/km):</v-col>
        <v-col>{{ car.co2Emission }}</v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="justify-space-around">
      <v-btn outlined rounded color="primary" @click="checkDeleteCar">
        Verwijder
      </v-btn>
      <v-btn v-if="isSelectedCar" outlined disabled rounded color="primary">
        Geselecteerd
      </v-btn>
      <v-btn v-else depressed rounded color="button" @click="setCar">
        Selecteren
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    car: {
      type: Object,
      required: true,
    },
    isSelectedCar: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    setCar() {
      this.$emit('set-car', this.car)
    },
    checkDeleteCar() {
      this.$emit('check-delete-car', this.car)
    },
  },
}
</script>
<style lang="scss" scoped>
.selected-car {
  //background-color: $background-light-green;
  //border-width: 3px;
  border-color: $color-secondary;
}
</style>
