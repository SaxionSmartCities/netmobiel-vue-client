<template>
  <v-row>
    <v-col>
      <v-divider></v-divider>
      <v-row @click="editTrip">
        <v-col cols="2">
          <v-icon>fa-pencil-alt</v-icon>
        </v-col>
        <v-col>
          Wijzig deze reis
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row @click="replanSameRoute">
        <v-col cols="2">
          <v-icon>fa-redo</v-icon>
        </v-col>
        <v-col>
          Plan deze reis opnieuw
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row @click="openConfirmationDialog">
        <v-col cols="2">
          <v-icon>fa-times-circle</v-icon>
        </v-col>
        <v-col>
          Annuleer deze reis
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
export default {
  name: 'ItineraryOptions',
  components: {},
  props: {},
  data() {
    return { dialog: false }
  },
  computed: {
    selectedTrip() {
      return this.$store.getters['is/getSelectedTrip']
    },
  },
  methods: {
    editTrip() {
      // eslint-disable-next-line
      console.log('Method not implemented!')
    },
    replanSameRoute() {
      // eslint-disable-next-line
      console.log('Method not implemented!')
    },
    openConfirmationDialog() {
      this.dialog = true
    },
    confirmTripCancellation() {
      this.closeConfirmationDialog()
      this.$store.dispatch('is/deleteSelectedTrip', {
        tripId: this.selectedTrip.id,
      })
      this.$router.push('/tripCancelledPage')
    },
    closeConfirmationDialog() {
      this.dialog = false
    },
  },
}
</script>

<style lang="scss"></style>
