<template>
  <v-container pa-2 column>
    <v-row>
      <v-divider></v-divider>
    </v-row>
    <v-row @click="editRoute">
      <v-col cols="3">
        <v-icon>fa-pencil-alt</v-icon>
      </v-col>
      <v-col cols 6>
        Wijzig deze reis
      </v-col>
    </v-row>
    <v-row>
      <v-divider></v-divider>
    </v-row>
    <v-row @click="replanSameRoute">
      <v-col cols="3">
        <v-icon>fa-redo</v-icon>
      </v-col>
      <v-col cols 6>
        Plan deze reis opnieuw
      </v-col>
    </v-row>
    <v-row @click="openConfirmation">
      <v-col cols="3">
        <v-icon>fa-times-circle</v-icon>
      </v-col>
      <v-col cols 6>
        Annuleer deze reis
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="320px">
      <v-card>
        <v-card-title><h1>Annuleer deze reis.</h1></v-card-title>
        <v-card-text>
          <span>
            Weet je zeker dat je deze reis wilt annuleren? Dit kan niet ongedaan
            gemaakt worden.
          </span>
        </v-card-text>
        <v-row my-4 mr-4 ml-4>
          <v-btn
            large
            rounded
            block
            mb-4
            depressed
            color="button"
            @click="deleteTrip"
          >
            Reis annuleren
          </v-btn>
        </v-row>
        <v-row my-4 mr-4 ml-4 pb-8>
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
            Reis toch bewaren
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
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
    },
  },
}
</script>

<style lang="scss"></style>
