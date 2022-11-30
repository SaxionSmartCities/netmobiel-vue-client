<template>
  <v-dialog
    v-model="dialogActive"
    max-width="300"
    @click:outside="$emit('close')"
  >
    <v-card>
      <v-card-title>Duurzaamheidsscore</v-card-title>
      <v-card-text class="d-flex flex-column text-body-1">
        <v-img
          :src="sustainabilityRatingIcon"
          max-width="250"
          contain="contain"
          class="align-self-center"
        />
        <span class="font-weight-bold align-self-center"
          >{{ itinerary.sustainabilityRating }} / 5</span
        >
        <span class="font-weight-bold align-self-center"
          >{{ sustainabilityRatingLabel }}!</span
        >
        <v-row class="pt-2 text-center text-body-2">
          <v-col class="col-6 text-left font-weight-bold">Reiskilometers</v-col>
          <v-col class="col-3 text-right">km</v-col>
          <v-col class="col-3 text-right text-no-wrap">kg CO2</v-col>
        </v-row>
        <v-row
          v-for="leg in itinerary.legs"
          :key="leg.id"
          dense
          class="text-body-2 text-no-wrap align-baseline"
        >
          <v-col class="col-6">
            <v-icon large class="text-primary">
              {{ getModalityIcon(leg.traverseMode) }}
            </v-icon>
            <span class="pl-1">{{ getModalityLabel(leg.traverseMode) }}</span>
          </v-col>
          <v-col class="col-3 text-right">{{
            (leg.distance / 1000).toFixed(1)
          }}</v-col>
          <v-col class="col-3 text-right">{{
            ((leg.co2EmissionRate * leg.distance) / (1000 * 1000)).toFixed(1)
          }}</v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-center">
        <v-btn outlined rounded color="primary" @click="$emit('close')">
          <span class="px-2">Terug</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import constants from '@/constants/constants'
import travelModes from '@/constants/travel-modes'

export default {
  name: 'SustainabilityDialog',
  props: {
    showDialog: { type: Boolean, required: true },
    itinerary: { type: Object, required: true },
  },
  computed: {
    dialogActive() {
      return this.showDialog
    },
    sustainabilityRatingIcon() {
      const rating = this.itinerary.sustainabilityRating
      if (Number.isInteger(rating) && rating >= 1 && rating <= 5) {
        const icon = constants.SUSTAINABILITY_RATINGS[rating - 1].iconPath
        return require(`@/assets/${icon}`)
      }
      return ''
    },
    sustainabilityRatingLabel() {
      const rating = this.itinerary.sustainabilityRating
      if (Number.isInteger(rating) && rating >= 1 && rating <= 5) {
        return constants.SUSTAINABILITY_RATINGS[rating - 1].label
      }
      return '?'
    },
  },
  methods: {
    getModalityIcon(modality) {
      return travelModes[modality]?.icon
    },
    getModalityLabel(modality) {
      return travelModes[modality]?.label
    },
  },
}
</script>
