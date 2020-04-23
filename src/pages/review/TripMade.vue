<template>
  <content-pane>
    <v-row>
      <v-col class="d-flex flex-column">
        <h3>Beoordeel jouw reis</h3>
        <span>
          Hoe heb jij deze reis ervaren? Geef jouw mening en laat Henk weten wat
          jij er van vond
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="showChips" class="px-0">
        <v-chip
          v-for="(compliment, index) in availableCompliments"
          :key="index"
          class="chip"
          :outlined="
            compliments.findIndex(c => c.value === compliment.value) === -1
          "
          :value="compliment.value"
          @click="addCompliment(compliment)"
        >
          {{ compliment.title }}
        </v-chip>
      </v-col>
      <v-col v-else class="px-0">
        <v-textarea v-model="inputTextArea" outlined></v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="rateTrip()">Beoordeel deze reis</v-btn>
        <v-btn @click="back()">Terug</v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../components/common/ContentPane'
import trip_made_config from '../../config/review/trip_made_config'

export default {
  name: 'TripMade',
  components: { ContentPane },
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
.chip {
  margin: 3px;
}
</style>
