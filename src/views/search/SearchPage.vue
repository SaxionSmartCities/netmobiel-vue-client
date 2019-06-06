<template>
  <v-container
    align-center
    justify-center
    fill-height
    fluid
    grid-list-lg
    class="background-primary"
  >
    <v-layout justify-center align-center>
      <v-flex xs11 sm9 md6>
        <v-layout column shrink>
          <v-flex class="box-widget background-white">
            <v-form>
              <v-layout>
                <v-flex text-xs-center xs12>
                  <h1>Waar wil je heen?</h1>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex id="vannaar" xs11>
                  <v-layout column>
                    <v-flex id="van">
                      <v-layout row>
                        <v-flex xs3 sm2>
                          <v-subheader class="font-weight-bold">
                            Van
                          </v-subheader>
                        </v-flex>
                        <v-flex>
                          <v-text-field v-model="fromLocation"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex id="naar">
                      <v-layout row>
                        <v-flex xs3 sm2>
                          <v-subheader class="font-weight-bold">
                            Naar
                          </v-subheader>
                        </v-flex>
                        <v-flex>
                          <v-text-field v-model="toLocation"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex d-flex>
                  <v-layout column justify-center>
                    <v-flex
                      id="heenweericoon"
                      text-xs-center
                      justify-center
                      shrink
                      @click="swapLocations()"
                    >
                      <v-icon>import_export</v-icon>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex id="aankomsttijd" xs11>
                  <v-layout row>
                    <v-flex xs4 sm2>
                      <v-subheader class="font-weight-bold">
                        Aankomst
                      </v-subheader>
                    </v-flex>
                    <v-flex>
                      <v-text-field value="Morgen, 10.00 uur"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex mt-2>
                  <v-btn large round block to="/searchResults">
                    Plan je reis!
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout mt-2 justify-center>
                <v-flex shrink @click="toRidePrefrences">
                  <v-icon>settings</v-icon>
                  <span>Reisvoorkeuren</span>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: function() {
    return {
      fromLocation: 'Enschede',
      toLocation: 'Deventer',
    }
  },
  methods: {
    toRidePrefrences() {
      this.$router.push({ name: 'ridePreferences' })
    },
    toSearchRideDate() {
      this.$router.push({ name: 'searchRideDate' })
    },
    swapLocations() {
      var tempLocation = this.fromLocation

      this.fromLocation = this.toLocation
      this.toLocation = tempLocation
    },
  },
}
</script>

<style lang="scss"></style>
