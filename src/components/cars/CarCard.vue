<template>
  <v-card outlined>
    <v-row no-gutters>
      <v-col>
        <v-card-title justify-center>
          <span>{{ car.brand }} {{ car.model }}</span>
          <v-spacer />
          <span class="booking-count">
            {{ car.licensePlate }}
          </span>
        </v-card-title>
        <v-card-subtitle>
          <span>{{ car.color }}</span>
        </v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col>
              <v-btn
                outlined
                rounded
                color="button"
                x-small
                @click="checkDeleteCar"
                >Verwijder</v-btn
              >
            </v-col>
            <v-col v-if="selectedCar == car.id">
              <v-btn outlined disabled rounded color="primary" x-small
                >Geselecteerde auto</v-btn
              >
            </v-col>
            <v-col v-else>
              <v-btn outlined rounded color="primary" x-small @click="setCar"
                >Selecteren</v-btn
              >
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
      type: Number,
      required: false,
      default: 0,
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
<style scoped>
.booking-count {
  color: rgba(0, 0, 0, 0.54);
  font-size: 75%;
}
</style>
