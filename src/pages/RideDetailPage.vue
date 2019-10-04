<template>
  <v-container>
    <v-layout column>
      <v-flex mb-3>
        <h3>Reisdetails</h3>
      </v-flex>
      <v-flex>
        <v-divider />
      </v-flex>
      <v-flex my-2>
        <v-layout>
          <v-flex>
            <v-layout column>
              <v-flex>
                <v-layout py-2>
                  <v-flex xs3>Datum</v-flex>
                  <v-flex>{{ printableDate }}</v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-divider />
      </v-flex>
      <v-flex mt-4>
        <v-alert type="info" value="true" color="blue">
          Op deze pagina zullen de reisdetails van de rit met
          {{ printableDriverName }} getoond worden. Deze functionaliteit is
          echter op dit moment nog niet gereed.
        </v-alert>
      </v-flex>
      <v-flex my-4>
        <v-btn large round block mb-4 @click="notifyDriver">
          Laat {{ printableDriverName }} weten dat je meerijdt!
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  name: 'RideDetailPage',
  computed: {
    selectedTrip: function() {
      return this.$store.getters['is/getSelectedTrip']
    },
    printableDate: function() {
      return moment(this.selectedTrip.date).format('DD-MM-YYYY')
    },
    printableDriverName: function() {
      if (this.selectedTrip.ride.driver === undefined) {
        return 'Voornaam'
      } else {
        return this.selectedTrip.ride.driver.givenName
      }
    },
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },

  methods: {
    notifyDriver: function() {
      // eslint-disable-next-line
      console.log('Notify driver ', this.selectedTrip.ride.driverRef)
      // WORK SOME MAGIC HERE
    },
  },
}
</script>

<style lang="scss"></style>
