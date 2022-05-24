<template>
  <v-row no-gutters>
    <v-col class="clickable-item" @click="onClickDriver">
      <v-row dense class="mt-1 align-center">
        <v-col class="shrink">
          <driver-image
            v-if="leg.driverId"
            :image-size="54"
            :avatar-size="60"
            :leg="leg"
          />
        </v-col>
        <v-col class="text-center">
          <v-btn small rounded depressed color="button"> Bekijk Profiel </v-btn>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <span v-if="leg.driverName === 'Jij'">
            <strong>{{ leg.driverName }}</strong> bent de chauffeur.
          </span>
          <span v-else>
            <strong>{{ leg.driverName }}</strong> is de chauffeur.
          </span>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <span>{{ leg.vehicleName }} ({{ leg.vehicleLicensePlate }})</span>
        </v-col>
      </v-row>
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
