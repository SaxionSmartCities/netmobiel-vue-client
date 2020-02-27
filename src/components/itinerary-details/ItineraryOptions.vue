<template>
  <v-layout pa-2 column>
    <v-flex>
      <v-layout column>
        <v-flex @click="editRoute">
          <v-divider></v-divider>
          <v-layout ma-3>
            <v-flex xs2>
              <v-icon>fa-pencil-alt</v-icon>
            </v-flex>
            <v-flex>Wijzig deze rit</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout column>
        <v-flex @click="replanSameRoute">
          <v-divider></v-divider>
          <v-layout ma-3>
            <v-flex xs2>
              <v-icon>fa-redo</v-icon>
            </v-flex>
            <v-flex>Plan deze reis opnieuw</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout column>
        <v-flex @click="removeRoute">
          <v-divider></v-divider>
          <v-layout ma-3>
            <v-flex xs2>
              <v-icon>fa-times-circle</v-icon>
            </v-flex>
            <v-flex>Annuleer deze reis</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-dialog v-model="dialog" persistent max-width="320px">
      <v-card>
        <v-card-title><h1>Annuleer deze rit.</h1></v-card-title>
        <v-card-text>
          <span>
            Weet je zeker dat je deze rit wilt annuleren? Dit kan niet ongedaan
            gemaakt worden.
          </span>
        </v-card-text>
        <v-flex my-4 mr-4 ml-4>
          <v-btn
            large
            rounded
            block
            mb-4
            depressed
            color="button"
            to="TripCanceledPage"
            onclick=""
          >
            Rit annuleren
          </v-btn>
        </v-flex>
        <v-flex my-4 mr-4 ml-4 pb-8>
          <v-btn
            large
            rounded
            outlined
            block
            mb-4
            depressed
            color="primairy"
            @click="closeConfirmation"
          >
            Rit toch bewaren
          </v-btn>
        </v-flex>
      </v-card>
    </v-dialog>
  </v-layout>
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
    },
    editRoute() {},
    replanSameRoute() {},
    closeConfirmation() {
      this.dialog = false
    },
    removeRoute() {
      this.deleteTrip()
      this.dialog = true
    },
  },
}
</script>

<style lang="scss"></style>
