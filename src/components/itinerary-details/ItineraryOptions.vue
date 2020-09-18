<template>
  <v-row>
    <v-col class="py-0">
      <v-divider v-if="!isPastTrip"></v-divider>
      <v-row v-if="!isPastTrip" @click="editTrip">
        <v-col cols="1">
          <v-icon>fa-pencil-alt</v-icon>
        </v-col>
        <v-col class="pl-5">
          Wijzig deze reis
        </v-col>
      </v-row>
      <v-divider v-if="!isShoutOut"></v-divider>
      <v-row v-if="!isShoutOut" @click="replanSameRoute">
        <v-col cols="1">
          <v-icon>fa-redo</v-icon>
        </v-col>
        <v-col class="pl-5">
          Plan deze reis opnieuw
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row v-if="isPastTrip">
        <v-col class="py-0">
          <v-row
            v-if="isRideShareTrip"
            @click="$emit('tripReview', selectedTrip)"
          >
            <v-col cols="1">
              <v-icon>fa-check-circle</v-icon>
            </v-col>
            <v-col class="pl-5">Bevestig deze reis</v-col>
          </v-row>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row v-else @click="openConfirmationDialog">
        <v-col class="py-0">
          <v-row>
            <v-col cols="1">
              <v-icon>fa-times-circle</v-icon>
            </v-col>
            <v-col class="pl-5">Annuleer deze reis</v-col>
          </v-row>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" persistent>
        <template v-slot:activator="{ on }"> </template>
        <v-card>
          <v-card-title class="headline">Annuleer deze reis</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                Weet je zeker dat je deze reis wilt annuleren? Dit kan niet
                ongedaan gemaakt worden.
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  large
                  rounded
                  block
                  mb-4
                  depressed
                  color="button"
                  @click="confirmTripCancellation"
                >
                  Reis annuleren
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
                  @click="closeConfirmationDialog"
                >
                  Reis toch bewaren
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ItineraryOptions',
  components: {},
  props: {
    selectedTrip: { type: Object, default: () => {} },
  },
  data() {
    return { dialog: false }
  },
  computed: {
    isPastTrip() {
      if (this.selectedTrip.legs) {
        const endTime = this.selectedTrip.legs[
          this.selectedTrip.legs.length - 1
        ]?.endTime
        return moment(endTime).isBefore(moment()) || false
      }
      return false
    },
    isRideShareTrip() {
      return !!this.selectedTrip.legs.find(l => l.traverseMode == 'RIDESHARE')
    },
    isShoutOut() {
      return this.selectedTrip.planType === 'SHOUT_OUT' || false
    },
  },
  methods: {
    editTrip() {
      this.$emit('tripEdit', this.selectedTrip)
    },
    replanSameRoute() {
      this.$emit('tripReplan', this.selectedTrip)
    },
    openConfirmationDialog() {
      this.dialog = true
    },
    confirmTripCancellation() {
      this.closeConfirmationDialog()
      this.$emit('tripCancelled', { tripId: this.selectedTrip.id })
    },
    closeConfirmationDialog() {
      this.dialog = false
    },
  },
}
</script>

<style lang="scss"></style>
