<template>
  <v-container
    align-center
    justify-center
    fill-height
    fluid
    grid-list-lg
    class="background-primary"
  >
    <v-row justify="center" align-content="center" class="mx-3">
      <v-col sm="9" md="6">
        <v-row class="flex-column shrink">
          <v-col class="box-widget background-white py-3">
            <v-row>
              <v-col>
                <v-form>
                  <v-row>
                    <v-col class="py-0">
                      <h2 class="mb-2">Wat wil je doen?</h2>
                    </v-col>
                  </v-row>

                  <v-col
                    class="mt-2 text-center flex-column py-0"
                    justify="center"
                  >
                    <v-col class="pa-0">
                      <v-row class="flex-column">
                        <v-col class="px-0 pb-1">
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
                        </v-col>
                        <v-col class="pa-0">
                          <span class="text-reducer-opacity body-2">
                            Met iemand meerijden of via het OV.
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="mt-4 pa-0">
                      <v-row class="flex-column">
                        <v-col class="px-0 pb-1">
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
                        </v-col>
                        <v-col class="py-0">
                          <span class="text-reducer-opacity body-2">
                            Zelf rijden en iemand meenemen.
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                </v-form>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ModeSelectionPage',
  mounted() {
    this.$store.commit('ui/setSelectedNav', 'planner')
    this.$store.commit('ui/addAppClass', 'modeSelectPage')
  },
}
</script>

<style lang="scss"></style>
