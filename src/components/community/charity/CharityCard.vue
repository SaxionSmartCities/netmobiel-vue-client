<template>
  <v-card outlined>
    <v-card-title class="pb-1" @click="$emit('lookupCharity', charity.urn)">
      <v-row no-gutters>
        <v-col class="shrink pr-3">
          <v-img
            class="charity-card-image"
            alt="Afbeelding van goede doel"
            :src="charityImage"
          />
        </v-col>
        <v-col>
          <div class="d-flex flex-column">
            <span>{{ charity.name }}</span>
            <span class="caption">{{ charity.location.label }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col class="pt-0">
          <span
            class="progressbar-text text-color-primary caption"
            :style="{ left: progressLeftOffsetRelative + '%' }"
          >
            {{ progress || 0 }}%
          </span>
          <v-progress-linear :value="progress" rounded />
        </v-col>
      </v-row>
      <v-row no-gutters justify="space-between" class="mx-auto">
        <v-col class="px-0 pb-0">
          <span v-if="creditsRemaining >= 0" class="caption"
            >Nog {{ creditsRemaining }} credits</span
          >
          <span v-else class="caption"
            >Al {{ -1 * creditsRemaining }} credits extra!</span
          >
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        class="font-weight-bold"
        small
        rounded
        depressed
        outlined
        @click="$emit('lookupCharity', charity.urn)"
      >
        Bekijken
      </v-btn>
      <v-btn
        v-if="canAdmin"
        color="primary"
        class="font-weight-bold"
        small
        rounded
        depressed
        outlined
        @click="$emit('adminCharity', charity.urn)"
      >
        Wijzigen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import defaultCharityImage from '@/assets/achterhoek_background.jpg'
export default {
  name: 'CharityCard',
  components: {},
  props: {
    charity: { type: Object, required: true },
    canAdmin: { type: Boolean, required: false, default: false },
  },
  computed: {
    charityImage() {
      return this.charity?.imageUrl
        ? this.charity?.imageUrl
        : defaultCharityImage
    },
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
    progressLeftOffsetRelative() {
      // Just leave some room for the text
      return Math.min(90, this.progress)
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
