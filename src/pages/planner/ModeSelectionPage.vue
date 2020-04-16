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
            <v-flex>
              <v-form>
                <v-layout>
                  <v-flex xs12>
                    <h1>Wat wil je doen?</h1>
                  </v-flex>
                </v-layout>

                <v-layout mt-2 column justify-center text-xs-center>
                  <v-flex>
                    <v-layout column>
                      <v-flex>
                        <v-btn
                          large
                          rounded
                          depressed
                          color="button"
                          block
                          to="/search"
                        >
                          Een reis plannen
                        </v-btn>
                      </v-flex>
                      <v-flex py-0>
                        <span class="mid-grey">
                          Met iemand meerijden of via het OV.
                        </span>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex mt-4>
                    <v-layout column>
                      <v-flex>
                        <v-btn
                          large
                          rounded
                          depressed
                          color="button"
                          block
                          to="/plan"
                        >
                          Een rit aanbieden
                        </v-btn>
                      </v-flex>
                      <v-flex py-0>
                        <span class="mid-grey">
                          Zelf rijden en iemand meenemen.
                        </span>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'ModeSelectionPage',
  mounted: function() {
    this.$store.commit('ui/setSelectedNav', 'planner')
  },
}
</script>

<style lang="scss"></style>
