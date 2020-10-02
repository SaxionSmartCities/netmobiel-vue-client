<template>
  <v-card max-width="500px" class="pa-5" outlined>
    <v-row>
      <v-col class="shrink py-0">
        <v-img
          class="charity-card-image"
          alt="Geen afbeelding beschikbaar"
          src="@/assets/default_charity_image.jpg"
        />
      </v-col>
      <v-col class="py-0 pl-1">
        <div class="d-flex flex-column">
          <span>{{ charity.name }}</span>
          <span class="overline">{{ charity.location.label }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <span
          class="progressbar-text text-color-primary caption"
          :style="{ left: progress - 3 + '%' }"
        >
          {{ progress || 0 }}%
        </span>
        <v-progress-linear :value="progress" rounded />
      </v-col>
    </v-row>
    <v-row justify="space-between" class="mx-auto">
      <v-col class="px-0 pb-0">
        <span class="caption">nog {{ creditsRemaining }} credits</span>
      </v-col>
      <v-col class="px-0 pb-0">
        <v-btn
          color="primary"
          class="font-weight-bold"
          small
          rounded
          depressed
          outlined
          @click="$emit('lookupCharity', String(charity.id))"
        >
          Bekijk dit doel
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'CharityCard',
  components: {},
  props: {
    charity: { type: Object, required: true },
  },
  computed: {
    creditsRemaining() {
      const goal = this.charity?.goalAmount || 0
      const donated = this.charity?.donatedAmount || 0
      return goal - donated
    },
    progress() {
      return Math.ceil(
        (this.charity.donatedAmount / this.charity.goalAmount) * 100
      )
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.charity-card-image {
  width: 75px;
  height: 75px;
  border-radius: 10px;
}

.progressbar-text {
  position: relative;
}
</style>
