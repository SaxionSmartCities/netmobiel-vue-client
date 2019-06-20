<template>
  <v-container>
    <v-layout id="pagina" column>
      <v-flex id="header"><h3>Reisdetails</h3></v-flex>
      <v-divider />
      <travel-summary
        :date="journey.startTime"
        :cost="5"
        :duration="journey.duration"
      ></travel-summary>
      <v-divider />
      <v-flex id="legs" mt-4>
        <v-layout column>
          <v-flex id="headerregel">
            <v-layout row align-center>
              <v-flex id="tijd" xs2>08:26 </v-flex>
              <v-flex id="bolletje" xs1 d-flex>
                <v-layout column justify-center d-flex>
                  <v-flex fill-height>
                    <div class="open-dot"></div>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex id="locatienaam">Huidige locatie</v-flex>
            </v-layout>
          </v-flex>
          <v-flex id="icoonborderdetails">
            <v-layout row>
              <v-flex id="icon" xs2><v-icon>directions_walk</v-icon></v-flex>
              <v-flex id="bordertje" xs1>|</v-flex>
              <v-flex id="details">Lorem ipsum</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex mt-4>
        <v-btn large round block>Deze reis bevestigen</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TravelSummary from '@/views/travel-details/TravelSummary.vue'

export default {
  name: 'TravelDetails',
  components: { TravelSummary },
  props: {
    journey: {
      type: Object,
      default: function() {
        return {}
      },
    },
  },
  data: function() {
    return {}
  },
}
</script>

<style lang="scss">
.open-dot {
  border-style: solid;
  border-width: 2px;
  border-radius: 10000px;
  border-color: green;
  width: 4vw;
  height: 4vw;
}

.hidden {
  //   visibility: hidden;
}

.filled-dot {
}
</style>
