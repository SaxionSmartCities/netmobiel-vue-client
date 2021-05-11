<template>
  <v-row no-gutters>
    <v-col>
      <driver-image :image-size="60" :avatar-size="66" :leg="leg" />
      <br />
      <span v-if="leg.driverName === 'Jij'">
        <b>{{ leg.driverName }}</b> bent de chauffeur.
      </span>
      <span v-else>
        <b>{{ leg.driverName }}</b> is de chauffeur.
      </span>
      <br />
      <span>{{ leg.vehicleName }} ({{ leg.vehicleLicensePlate }})</span>
    </v-col>
  </v-row>
</template>

<script>
import DriverImage from '@/components/itinerary-details/DriverImage'
import * as psStore from '@/store/profile-service'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'ItineraryLegDriver',
  components: { DriverImage },
  props: {
    leg: { type: Object, required: true },
  },
}
</script>

<style lang="scss"></style>
