<template>
  <v-container>
    <v-subheader class="headline">Reisvoorkeuren</v-subheader>
    <v-divider></v-divider>
    <v-layout>
      <v-flex>
        <v-subheader class="font-weight-bold">Personen</v-subheader>
      </v-flex>
      <v-flex xs9>
        <v-text-field type="number" max="10" required value="1"></v-text-field>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout>
      <v-flex>
        <v-subheader class="font-weight-bold">Bagage</v-subheader>
      </v-flex>
      <v-flex xs9>
        <v-select :items="bagage" attach multiple></v-select
      ></v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout>
      <v-flex>
        <v-subheader class="font-weight-bold">Overstappen</v-subheader>
      </v-flex>
      <v-flex xs9>
        <v-select attach :items="overstappen" required></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout>
      <v-flex>
        <v-subheader class="font-weight-bold">Sorteren</v-subheader>
      </v-flex>
      <v-flex xs9>
        <v-select attach :items="sorteren"></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout justify-space-between>
      <v-flex>
        <v-subheader class="font-weight-bold">Vermijden</v-subheader>
      </v-flex>
      <v-flex xs9>
        <v-select :items="vermijden" attach multiple></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
  </v-container>
</template>

<script>
export default {
  name: 'RidePreferences',
  data: function() {
    return {
      //hardcoded lists, must be changed later
      overstappen: ['Ja', 'Nee'],
      sorteren: ['Reistijd', 'Prijs', 'Bekenden'],
      bagage: ['Buggy', 'Handbagage', 'Huisdier', 'Rollator', 'Rolstoel'],
      vermijden: ['Bus', 'Trein', 'Lopen', 'Fiets'],
    }
  },
}
</script>

<style lang="scss">
.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}
</style>
