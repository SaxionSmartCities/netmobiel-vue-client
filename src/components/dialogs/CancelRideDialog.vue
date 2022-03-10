<template>
  <v-card class="py-1 px-3">
    <v-card-title class="headline"> Rit Verwijderen </v-card-title>
    <v-card-text>
      <v-row class="d-flex flex-column">
        <v-col v-if="numBookings > 0" class="py-0">
          <p v-if="confirmedBookings.length === 0">
            Deze rit bevat een aanbod aan een passagier, meld met een
            persoonlijke boodschap waarom je het aanbod intrekt.
          </p>
          <p v-else>
            Je rit heeft een bevestigde boeking van een passagier, meld met een
            persoonlijke boodschap waarom je de rit annuleert.
          </p>
          <v-textarea
            v-model="cancelReason"
            outlined
            :auto-grow="true"
            rows="3"
            hide-details="true"
            label="Reden voor annulering"
          ></v-textarea>
        </v-col>
        <!-- A recurrent ride with a booking is never treated as regular recurrent ride -->
        <v-col v-else-if="isRecurrentRide" class="py-0">
          <p>
            Je gaat een rit verwijderen die ingevoerd is als reeks. Welk deel
            van de reeks wil je verwijderen?
          </p>
          <v-radio-group v-model="rideScopeRadio">
            <v-radio label="Alleen deze rit" value="this" />
            <v-radio
              label="Deze en alle volgende ritten"
              value="this-and-following"
            />
          </v-radio-group>
        </v-col>
        <v-col v-else class="py-0">
          Weet je zeker dat je deze rit wilt annuleren?
        </v-col>
      </v-row>
      <v-row class="d-flex flex-column py-2">
        <v-col class="py-1">
          <v-btn
            large
            rounded
            block
            mb-4
            depressed
            color="button"
            :disabled="isDisabled"
            @click="onDelete"
          >
            Verwijderen
          </v-btn>
        </v-col>
        <v-col class="py-1">
          <v-btn
            large
            rounded
            outlined
            block
            mb-4
            depressed
            color="primary"
            @click="onCancel"
          >
            Annuleren
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'CancelRideDialog',
  components: {},
  props: {
    ride: { type: Object, required: true },
  },
  data() {
    return {
      rideScopeRadio: null,
      cancelReason: undefined,
    }
  },
  computed: {
    deleteScope() {
      return this.numBookings > 0 ? 'this' : this.rideScopeRadio
    },
    isDisabled() {
      return this.isRecurrentRide && this.deleteScope === null
    },
    isRecurrentRide() {
      return this.ride.recurrence !== undefined
    },
    confirmedBookings() {
      return !this.ride?.bookings
        ? []
        : this.ride.bookings.filter(
            (booking) => booking.state.toUpperCase() === 'CONFIRMED'
          )
    },
    activeBookings() {
      return !this.ride?.bookings
        ? []
        : this.ride.bookings.filter(
            (booking) => booking.state.toUpperCase() !== 'CANCELLED'
          )
    },
    numBookings() {
      return this.activeBookings.length
    },
  },
  methods: {
    onDelete() {
      this.$emit('delete', {
        scope: this.deleteScope,
        cancelReason: this.cancelReason,
      })
    },
    onCancel() {
      this.$emit('cancel')
    },
  },
}
</script>
