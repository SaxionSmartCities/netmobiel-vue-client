<template>
  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title class="headline"> Wijzig deze rit. </v-card-title>

      <v-card-text>
        <p>
          Let op! je gaat een rit wijzigen die ingevoerd is als reeks. Wat wil
          je wijzigen?
        </p>

        <v-radio-group v-model="rideChoiceRadio">
          <v-radio
            label="Alleen deze rit"
            value="editTripCurrent"
            selected
          ></v-radio>
          <v-radio
            label="Deze en alle volgende ritten"
            value="EditTripCurrentAndPlanned"
            disabled
          ></v-radio>
        </v-radio-group>
        <v-row>
          <v-col>
            <v-btn
              large
              rounded
              block
              mb-4
              depressed
              color="button"
              max-width="400"
            >
              Wijzigen
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              large
              rounded
              outlined
              block
              mb-4
              depressed
              color="primary"
              @click="showDialog = false"
            >
              Annuleren
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EditRideModal',
  props: {
    show: {
      type: Boolean,
    },
  },
  data() {
    return {
      rideChoiceRadio: 'editTripCurrent',
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show
      },
      set(newValue) {
        this.$emit('close', newValue)
      },
    },
  },
}
</script>

<style scoped></style>
