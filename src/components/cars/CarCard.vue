<template>
  <v-card outlined :class="{ 'selected-car': isSelectedCar }">
    <v-card-title class="justify-space-between">
      <span>{{ car.brand }} {{ car.model }}</span>
      <v-icon v-if="isSelectedCar">directions_car</v-icon>
    </v-card-title>
    <v-card-subtitle>
      <span>Kenteken: {{ car.licensePlate }}</span>
      <br />
      <span>Bouwjaar: {{ car.registrationYear }}</span>
      <br />
      <span>Kleur: {{ car.color }}</span>
    </v-card-subtitle>
    <v-card-text>
      <v-row dense>
        <v-col>
          <v-btn outlined rounded color="primary" @click="checkDeleteCar">
            Verwijder
          </v-btn>
        </v-col>
        <v-col v-if="isSelectedCar" align="right">
          <v-btn outlined disabled rounded color="primary">
            Geselecteerd
          </v-btn>
        </v-col>
        <v-col v-else align="right">
          <v-btn depressed rounded color="button" @click="setCar">
            Selecteren
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
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
