<template>
  <v-row>
    <v-col class="pt-0">
      <v-row dense>
        <v-col cols="3">
          <round-user-image :image-size="60" :avatar-size="66">
          </round-user-image>
        </v-col>
        <v-col>
          <v-row dense>
            <v-col>
              <span class="subtitle-2 text-no-wrap pr-2">{{
                trip.legs[0].driverName
              }}</span>
              <br />
              <span class="overline">
                Van {{ trip.from.label }} naar {{ trip.to.label }}
              </span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>Beoordeel jouw reis</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span>
            Hoe heb jij deze reis ervaren? Geef jouw mening en laat
            {{ trip.legs[0].driverName }} weten wat jij er van vond.
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="showChips">
          <v-chip
            v-for="(compliment, index) in availableCompliments"
            :key="index"
            :ripple="false"
            class="compliment-chip"
            :class="{
              'compliment-chip-active':
                compliments.findIndex(c => c.value === compliment.value) !== -1,
            }"
            :value="compliment.value"
            @click="addCompliment(compliment)"
          >
            {{ compliment.title }}
          </v-chip>
        </v-col>
        <v-col v-else>
          <v-chip
            v-for="(compliment, index) in compliments"
            :key="index"
            :ripple="false"
            class="compliment-chip compliment-chip-active"
            :value="compliment.value"
          >
            {{ compliment.title }}
          </v-chip>
          <v-textarea
            v-model="inputTextArea"
            class="pt-2"
            placeholder="Beschrijving..."
            :hide-details="true"
            outlined
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            class="my-2"
            block
            rounded
            depressed
            color="button"
            @click="rateTrip()"
          >
            {{ showChips ? 'Volgende' : 'Beoordeel deze reis' }}
          </v-btn>
          <v-btn block outlined rounded color="primary" @click="back()">
            Terug
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import trip_made_config from '../../config/review/trip_made_config'

export default {
  name: 'TripMade',
  components: { RoundUserImage },
  props: {
    trip: { type: Object, required: true },
  },
  data() {
    return {
      availableCompliments: trip_made_config,
      compliments: [],
      feedbackMessage: '',
      showChips: true,
      inputTextArea: null,
    }
  },
  methods: {
    addCompliment(compliment) {
      const index = this.compliments.findIndex(
        c => c.value === compliment.value
      )
      if (index === -1) this.compliments.push(compliment)
      else this.compliments.splice(index, 1)
    },
    back() {
      this.$emit('back', {})
      !this.showChips && (this.showChips = true)
    },
    rateTrip() {
      if (this.showChips) {
        this.showChips = false
        this.$emit('nextStep', {})
      } else {
        this.$emit('rateTrip', {
          compliments: this.compliments,
          feedbackMessage: this.inputTextArea,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.compliment-chip {
  margin: 3px;
  box-shadow: none;
  border: none;
  color: $color-primary;
  background: rgba($color-primary, 0.05) !important;
}
.compliment-chip-active {
  color: white;
  background: $color-primary !important;
}
</style>
