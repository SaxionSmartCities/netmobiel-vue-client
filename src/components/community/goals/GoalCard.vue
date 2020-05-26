<template>
  <v-card outlined>
    <v-row>
      <v-col cols="4" class="pl-8">
        <round-user-image :image-size="69" :avatar-size="75">
        </round-user-image>
      </v-col>
      <v-col class="mx-auto">
        <v-row>
          <span class="subtitle-2 text-no-wrap pr-2"> {{ titel }} </span>
        </v-row>
        <v-row>
          <span class="overline">{{ plaatsnaam }}</span>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-progress-linear :value="creditsDonated"></v-progress-linear>
      </v-col>
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
import RoundUserImage from '@/components/common/RoundUserImage'

export default {
  name: 'GoalCard',
  components: {
    RoundUserImage,
  },
  props: {
    id: { type: Number, required: true },
    titel: { type: String, required: true },
    plaatsnaam: { type: String, required: true },
    creditsDonated: { type: Number, default: 0 },
    creditsTotal: { type: Number, default: 125 },
  },
  computed: {
    creditsRemaining() {
      return this.creditsTotal - this.creditsDonated
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
