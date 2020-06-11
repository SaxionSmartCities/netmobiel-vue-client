<template>
  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title class="headline">
        Wijzig deze rit.
      </v-card-title>

      <v-card-text>
        <p>
          Let op! je gaat een rit wijzigen die ingevoerd is als reeks. Wat wil
          je wijzigen?
        </p>
      </v-card-text>
      <v-radio-group v-model="radioRide">
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
        <v-radio label="Alle ritten" value="EditTripAll" disabled></v-radio>
      </v-radio-group>
      <v-card-actions>
        <v-btn text color="primary" @click="deleteTrip()">
          Ja
        </v-btn>

        <v-btn text color="primary">
          Nee
        </v-btn>
      </v-card-actions>
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
    users: {
      type: Array,
      default: () => [],
    },
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
