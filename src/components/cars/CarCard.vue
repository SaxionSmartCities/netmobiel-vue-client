<template>
  <v-card outlined>
    <v-row no-gutters>
      <v-col>
        <v-card-title justify-center>
          <span>{{ car.brand }} {{ car.model }}</span>
          <v-spacer />
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
              <v-btn outlined rounded color="button" @click="checkDeleteCar">
                Verwijder
              </v-btn>
            </v-col>
            <v-col v-if="isSelectedCar" align="right">
              <v-btn outlined disabled rounded color="primary">
                Geselecteerd
              </v-btn>
            </v-col>
            <v-col v-else align="right">
              <v-btn outlined rounded color="primary" @click="setCar">
                Selecteren
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  props: {
    car: {
      type: Object,
      required: true,
    },
    selectedCar: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    isSelectedCar() {
      return (
        this.selectedCar === String(this.car.id) ||
        this.selectedCar === this.car.carRef
      )
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
<style scoped></style>
