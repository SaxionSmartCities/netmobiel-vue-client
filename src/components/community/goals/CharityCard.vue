<template>
  <v-card outlined>
    <v-row>
      <v-col cols="4" class="pl-8">
        <round-user-image :image-size="69" :avatar-size="75">
        </round-user-image>
      </v-col>
      <v-col class="mx-auto">
        <v-row>
          <span class="subtitle-2 text-no-wrap pr-2">
            {{ charity.place }}
          </span>
        </v-row>
        <v-row>
          <span class="overline">{{ charity.place }}</span>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-progress-linear :value="0"></v-progress-linear>
      </v-col>
    </v-row>
    <v-row class="mx-auto">
      <v-col>
        <span class="pl-2 subtitle-1 font-weight-light">
          nog {{ creditsRemaining }} credits
        </span>
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
  name: 'CharityCard',
  components: {
    RoundUserImage,
  },
  props: {
    charity: { type: Object, required: true },
  },
  computed: {
    creditsRemaining() {
      return 20
    },
  },
  methods: {},
}
</script>

<style scoped></style>
