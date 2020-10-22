<template>
  <v-card outlined>
    <v-row no-gutters>
      <v-col>
        <v-card-title class="pb-1">
          <v-row no-gutters>
            <v-col class="shrink pr-3">
              <v-img
                class="charity-card-image"
                alt="Geen afbeelding beschikbaar"
                src="@/assets/default_charity_image.jpg"
              />
            </v-col>
            <v-col>
              <div class="d-flex flex-column">
                <span>{{ charity.name }}</span>
                <span class="overline">{{ charity.location.label }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
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
              <span class="caption">Nog {{ creditsRemaining }} credits</span>
            </v-col>
            <v-col class="px-0 pb-0" align="right">
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
        </v-card-text>
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
