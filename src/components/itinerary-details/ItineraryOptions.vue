<template>
  <v-layout pa-2 column>
    <v-flex>
      <v-layout column>
        <v-flex>
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
        <v-flex>
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
        <v-flex @click="reviewTrip">
          <v-divider></v-divider>
          <v-layout ma-3>
            <v-flex xs2>
              <v-icon>fa-redo</v-icon>
            </v-flex>
            <v-flex>Beoordeel deze reis</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout column>
        <v-flex @click="openConfirmation">
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
            @click="deleteTrip"
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
    <v-dialog v-model="thesaurusDialog" persistent max-width="500px">
      <v-card>
        <v-card-title><h1>Beoordeel jouw rit!</h1></v-card-title>
        <v-card-text>
          <span>
            Hoe heb je deze rit ervaren? Geef jouw mening en laat weten wat jij
            ervan vond.
          </span>
        </v-card-text>
        <v-row justify="space-around">
          <v-col cols="10" sm="10" md="10">
            <v-chip-group column active-class="primary--text">
              <v-chip v-for="tag in tags" :key="tag">
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
        <v-flex my-4 mr-4 ml-4>
          <v-btn
            large
            rounded
            block
            mb-4
            depressed
            color="button"
            @click="closeThesaurusDialog()"
          >
            Beoordeel deze rit
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
            @click="thesaurusDialog = false"
          >
            Annuleren
          </v-btn>
        </v-flex>
      </v-card>
    </v-dialog>
    <v-dialog v-model="commentDialog" persistent max-width="500px">
      <v-card>
        <v-card-title><h1>Beoordeel jouw rit!</h1></v-card-title>
        <v-card-text>
          <span>
            Hoe heb je deze rit ervaren? Geef jouw mening en laat weten wat jij
            ervan vond.
          </span>
        </v-card-text>
        <v-flex my-4 mr-4 ml-4>
          <v-textarea
            pa-md-4
            clearable
            clear-icon="cancel"
            flat
            outlined
            solo
            label="Cory is een vriendlijke passagier en reageert direct. De volgende keer neem ik haar graag weer mee!"
          ></v-textarea>
        </v-flex>
        <v-flex my-8 mr-4 ml-4>
          <v-btn
            large
            rounded
            block
            mb-4
            depressed
            color="button"
            @click="confirmReview()"
          >
            Beoordeel deze rit
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
            @click="thesaurusDialog = false"
          >
            Terug
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
    return {
      dialog: false,
      thesaurusDialog: false, //dialog to select keywords
      commentDialog: false, //dialog to add commment after selecting keyword
      tags: [
        'Zelfde interesses',
        'Op tijd',
        'Soepele communicatie',
        'Gezellig',
      ],
    }
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
    closeThesaurusDialog() {
      this.thesaurusDialog = false
      this.commentDialog = true
    },
    reviewTrip() {
      this.thesaurusDialog = true
    },
    openConfirmation() {
      this.dialog = true
    },
    closeConfirmation() {
      this.dialog = false
      this.$router.push('/tripCancelledPage')
    },
    confirmReview() {
      this.thesaurusDialog = false
      this.$router.push('/tripReviewedPage')
    },
  },
}
</script>

<style lang="scss"></style>
