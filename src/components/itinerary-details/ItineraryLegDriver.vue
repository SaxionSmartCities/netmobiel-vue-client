<template>
  <v-row no-gutters>
    <v-col class="clickable-item" @click="onClickDriver">
      <driver-image
        v-if="leg.driverId"
        :image-size="54"
        :avatar-size="60"
        :leg="leg"
      />
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
import { decodeUrn } from '@/utils/UrnHelper'

export default {
  name: 'ItineraryLegDriver',
  components: { DriverImage },
  props: {
    leg: { type: Object, required: true },
  },
  computed: {
    driverId() {
      return decodeUrn(this.leg.driverId)?.id
    },
  },
  methods: {
    onClickDriver() {
      this.$router.push({
        name: 'userProfile',
        params: {
          profileId: this.driverId,
        },
      })
    },
  },
}
</script>

<style lang="scss"></style>
