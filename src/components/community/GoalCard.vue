<template>
  <v-card class="mx-auto" outlined>
    <v-row class="mx-auto">
      <v-col class="pl-8 pt-2" wrap>
        <v-list-item-avatar tilesize="100" color="grey"></v-list-item-avatar>
      </v-col>
      <v-col>
        <v-row>
          <span class="subtitle-2 text-no-wrap pr-2"
            >Renovatie St. Bonifatiuskerk
          </span>
        </v-row>
        <v-row>
          <span class="overline">Lichtenvoorde</span>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="ma-auto pl-4 pr-4">
      <v-progress-linear value="15"></v-progress-linear>
    </v-row>
    <v-row class="mx-auto">
      <v-col
        ><span class="pl-2 subtitle-1 font-weight-light">nog 185 credits</span>
      </v-col>
      <v-col class="pr-4"
        ><v-btn
          color="primary"
          class="font-weight-bold"
          small
          rounded
          block
          depressed
          outlined
          to="/goalDetails"
        >
          Bekijk dit doel
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'GoalCard',
}
</script>

<style scoped></style>
