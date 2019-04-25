<template>
  <v-container fluid>
    <v-layout column wrap>
      <v-flex>
        <v-subheader class="headline">Aankomst</v-subheader>
        <v-subheader class="text-uppercase body-2" id="subheaderDate"
          >Datum</v-subheader
        >
      </v-flex>
      <v-flex>
        <v-date-picker
          v-model="date"
          no-title="true"
          color="background-orange"
          locale="nl"
          full-width
        ></v-date-picker>
        <!--<v-date-picker-->
        <!--v-model="date"-->
        <!--color="background-orange"-->
        <!--header-color="background-green"-->
        <!--full-width-->
        <!--landscape-->
        <!--class="mt-3"-->
        <!--&gt;</v-date-picker>-->
      </v-flex>
      <v-flex>
        <v-subheader class="text-uppercase body-2" id="subheaderTime"
          >Tijd</v-subheader
        >
      </v-flex>
      <v-divider></v-divider>
      <v-flex xs12>
        <v-btn-toggle v-model="toggle_multiple">
          <v-btn :value="1" flat>
            07:00
          </v-btn>

          <v-btn :value="2" flat>
            07:30
          </v-btn>

          <v-btn :value="3" flat>
            08:00
          </v-btn>

          <v-btn :value="4" flat>
            08:30
          </v-btn>
        </v-btn-toggle>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'SearchRideDate',
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
    }
  },
  methods: {
    formatWeekday() {},
  },
}
</script>

<style lang="scss">
.theme--light.v-subheader.text-uppercase.body-2 {
  color: $color-green;
}

.v-btn .v-btn__content .v-icon {
  color: $color-green;
}

.v-btn--active {
  background-color: $color-orange;
}
</style>
