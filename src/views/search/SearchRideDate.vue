<template>
  <v-container fluid>
    <v-layout column wrap>
      <v-flex>
        <v-subheader class="headline">Aankomst</v-subheader>
        <v-subheader id="subheaderDate" class="text-uppercase body-2"
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
      </v-flex>
    </v-layout>

    <v-subheader id="subheaderTime" class="text-uppercase body-2"
      >Tijd</v-subheader
    >
    <v-divider></v-divider>

    <v-layout class="timeContainer">
      <v-content>
        <v-btn-toggle class="ma-3" v-for="i in list" :key="`2${i}`">
          <v-btn class="px-3" :value="1" flat>
            {{ timeStamp }}
          </v-btn>
        </v-btn-toggle>
      </v-content>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'SearchRideDate',
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      list: 8,
      timeStamp: '07:30',
    }
  },
}
</script>

<style lang="scss">
.theme--light.v-subheader.text-uppercase.body-2 {
  color: $color-green;
}

.timeContainer {
  white-space: nowrap;
  overflow-y: scroll;
}

.v-btn--active {
  background-color: $color-orange;
}

.v-btn--active div {
  color: white;
}

.v-icon.material-icons.theme--light {
  color: $color-green;
}
</style>
