<template>
  <v-row>
    <v-col>
      <v-divider></v-divider>
      <v-row @click="editRoute">
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
      <v-row @click="removeRoute">
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
          <v-card-title class="headline">Annuleer deze rit.</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                Weet je zeker dat je deze rit wilt annuleren? Dit kan niet
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
                  @click="closeConfirmation"
                >
                  Rit annuleren
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
                  color="primairy"
                  @click="closeDialog"
                >
                  Rit toch bewaren
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
  data: function() {
    return { dialog: false }
  },
  computed: {
    selectedTrip() {
      return this.$store.getters['is/getSelectedTrip']
    },
  },
  methods: {
    deleteTrip() {
      this.$store.dispatch('is/deleteSelectedTrip', {
        tripId: this.selectedTrip.id,
      })
      this.$router.push('/tripCanceledPage')
    },
    editRoute() {},
    replanSameRoute() {},
    openConfirmation() {
      this.dialog = true
    },
    closeConfirmation() {
      this.dialog = false
      this.$router.push('/tripCancelledPage')
    },
    closeDialog() {
      this.dialog = false
    },
  },
}
</script>

<style lang="scss"></style>
