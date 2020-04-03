<template>
  <v-card class="mx-auto" outlined>
    <v-row class="mx-auto">
      <v-col class="pl-8 pt-2" wrap>
        <v-list-item-avatar tilesize="100" color="grey"></v-list-item-avatar>
      </v-col>
      <v-col>
        <v-row>
          <span class="subtitle-2 text-no-wrap pr-2"> {{ titel }} </span>
        </v-row>
        <v-row>
          <span class="overline">{{ plaatsnaam }}</span>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="ma-auto pl-4 pr-4">
      <v-progress-linear :value="remainingValue"></v-progress-linear>
    </v-row>
    <v-row class="mx-auto">
      <v-col
        ><span class="pl-2 subtitle-1 font-weight-light"
          >nog {{ creditsRemaining }} credits</span
        >
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
          @click="showDetails(id)"
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
  props: {
    id: { type: Number, required: true },
    titel: { type: String, required: true },
    plaatsnaam: { type: String, required: true },
    creditsRemaining: { type: Number, default: 0 },
    creditsTotal: { type: Number, default: 125 },
  },
  computed: {
    remainingValue() {
      return this.creditsTotal - this.creditsRemaining
    },
  },
  methods: {
    showDetails(id) {
      this.$router.push({
        path: `/goalDetails/${id}`,
      })
    },
  },
}
</script>

<style scoped></style>
