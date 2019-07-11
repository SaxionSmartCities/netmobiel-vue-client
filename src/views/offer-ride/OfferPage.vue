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
                  <h1>Waar rijd je heen?</h1>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex id="vannaar" xs11>
                  <v-layout column>
                    <v-flex id="van">
                      <v-layout row>
                        <v-flex xs4 sm2>
                          <v-subheader class="font-weight-bold">
                            Van
                          </v-subheader>
                        </v-flex>
                        <v-flex>
                          <v-text-field
                            v-model="this.$store.getters.getFromOfferLocation"
                            readonly
                            placeholder="Zoek locatie"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex id="naar">
                      <v-layout row>
                        <v-flex xs4 sm2>
                          <v-subheader class="font-weight-bold">
                            Naar
                          </v-subheader>
                        </v-flex>
                        <v-flex>
                          <v-text-field
                            v-model="this.$store.getters.getToOfferLocation"
                            readonly
                            placeholder="Zoek locatie"
                          ></v-text-field>
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
                <v-flex xs11>
                  <v-layout column>
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4 sm2>
                          <v-subheader class="font-weight-bold">
                            Vertrek
                          </v-subheader>
                        </v-flex>
                        <v-flex>
                          <v-text-field
                            v-model="departureTime"
                            readonly
                            placeholder="Selecteer datum en tijd"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4 sm2>
                          <v-subheader class="font-weight-bold">
                            Herhalen
                          </v-subheader>
                        </v-flex>
                        <v-flex>
                          <v-text-field
                            readonly
                            :value="
                              $store.getters.getRideOfferPreferences.repeat
                            "
                            @click="$router.push('repeatSelection')"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout mt-2 justify-center text-xs-center>
                <v-flex>
                  <v-btn
                    v-if="optionsSetted === false"
                    class="orange-white-button"
                    large
                    round
                    block
                    :to="{ name: 'offerRideOptions' }"
                  >
                    Verder
                  </v-btn>
                  <v-btn
                    v-else
                    class="orange-white-button"
                    large
                    round
                    block
                    :to="{ name: 'ridePlanned' }"
                  >
                    Plan rit!
                  </v-btn>
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
  name: 'OfferPage',
  data: function() {
    return {
      waiting: null,
      departureTime: '',
      repeat: '',
      optionsSetted: true,
    }
  },
  created() {
    const rideOffer = Object.values(this.$store.getters.getRideOfferPreferences)
    console.log('ride', rideOffer)
    for (let i = 0; i < rideOffer.length; i++) {
      if (rideOffer[i] === null) {
        this.optionsSetted = false
        break
      }
    }
  },
  methods: {
    swapLocations() {
      let to = this.$store.getters.getToOfferLocation
      this.$store.commit('setToOfferLocation', {
        name: this.$store.getters.getFromOfferLocation,
      })
      this.$store.commit('setFromOfferLocation', { name: to })
    },
  },
}
</script>

<style scoped></style>
