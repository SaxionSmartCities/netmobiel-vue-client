<template>
  <content-pane>
    <v-row class="flex-column">
      <v-col>
        <h1>Rit heeft niet plaatsgevonden</h1>
      </v-col>
      <v-col>
        Wat is de reden dat de rit niet heeft plaatsgevonden?
      </v-col>
      <v-col>
        <v-radio-group v-model="tripNotMadeReason" class="mt-1" column>
          <v-radio
            v-for="reason in tripNotMadeReasons"
            :key="reason.value"
            :label="reason.title"
            :value="reason.value"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col>
        <v-btn
          class="my-2"
          large
          block
          rounded
          color="button"
          depressed
          :disabled="!tripNotMadeReason"
          @click="tripNotMade()"
        >
          Opslaan
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import constants from '@/constants/constants'
import ContentPane from '@/components/common/ContentPane.vue'
import * as uiStore from '@/store/ui'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'TripNotMadePage',
  components: {
    ContentPane,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      tripNotMadeReasons: constants.TRIP_NOT_MADE_REASONS,
      tripNotMadeReason: null,
    }
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    tripNotMade() {
      isStore.actions.rejectTrip({ id: this.id })
    },
  },
}
</script>

<style scoped></style>
