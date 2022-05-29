<template>
  <router-link to="/cars">
    <span v-if="!selectedCar" class="color-alert-red font-weight-bold"
      >Voer eerst je auto in</span
    >
    <span v-else
      >{{ selectedCar.brand }} {{ selectedCar.model }} ({{
        selectedCar.licensePlate
      }})</span
    >
  </router-link>
</template>

<script>
export default {
  name: 'CarViewer',
  props: {
    selectedCar: { type: Object, default: () => undefined },
  },
}
</script>
