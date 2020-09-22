<template>
  <v-row>
    <v-col class="pt-0">
      <v-row dense>
        <v-col cols="3">
          <round-user-image
            :profile-image="driverProfileImage()"
            :image-size="60"
            :avatar-size="66"
          >
          </round-user-image>
        </v-col>
        <v-col>
          <span class="subtitle-2 text-no-wrap pr-2">
            {{ itinerary.legs[0].driverName }}
          </span>
          <br />
          <span class="caption">
            van <b>{{ trip.from.label }} </b> naar <b> {{ trip.to.label }} </b>
          </span>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col>
          <div>
            <h3>Beoordeel jouw reis</h3>
            <span class="body-2">
              Hoe heb jij deze reis ervaren? Geef jouw mening en laat
              {{ itinerary.legs[0].driverName }} weten wat jij er van vond.
            </span>
            <div class="mt-4">
              <div v-if="showChips && availableCompliments">
                <v-chip
                  v-for="compliment in availableCompliments"
                  :key="compliment"
                  :ripple="false"
                  class="compliment-chip body-2"
                  :class="{
                    'compliment-chip-active':
                      compliments.findIndex(c => c === compliment) !== -1,
                  }"
                  :value="compliment"
                  @click="addCompliment(compliment)"
                >
                  {{ compliment }}
                </v-chip>
              </div>
              <div v-else>
                <v-chip
                  v-for="(compliment, index) in compliments"
                  :key="index"
                  :ripple="false"
                  class="compliment-chip body-2 compliment-chip-active"
                  :value="compliment"
                >
                  {{ compliment }}
                </v-chip>
                <v-textarea
                  v-model="inputTextArea"
                  class="pt-2"
                  placeholder="Beschrijving..."
                  :hide-details="true"
                  outlined
                ></v-textarea>
              </div>
            </div>
          </div>
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
            :disabled="compliments.length === 0"
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
import constants from '@/constants/constants'
import config from '@/config/config'
import * as psStore from '@/store/profile-service'

export default {
  name: 'TripMade',
  components: { RoundUserImage },
  props: {
    trip: { type: Object, required: true },
    driverProfile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      compliments: [],
      feedbackMessage: '',
      showChips: true,
      inputTextArea: null,
    }
  },
  computed: {
    itinerary() {
      return this.trip?.itinerary
    },
    availableCompliments() {
      return psStore.getters.getComplimentTypes
    },
  },
  mounted() {
    psStore.actions.fetchComplimentTypes()
  },
  methods: {
    addCompliment(compliment) {
      const index = this.compliments.findIndex(c => c === compliment)
      if (
        this.compliments.length < constants.maxComplimentsAllowed &&
        index === -1
      ) {
        //Not reached the limit of compliments and the compliment is NOT in the list yet.
        this.compliments.push(compliment)
      } else if (
        // Limit reached and the compliment is not in the list.
        // Remove the first compliment selected and add the one selected
        this.compliments.length === constants.maxComplimentsAllowed &&
        index === -1
      ) {
        this.compliments.splice(index, 1)
        this.compliments.push(compliment)
      } else {
        // If a compliment gets selected when it already is, then it will be removed.
        this.compliments.splice(index, 1)
      }
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
    driverProfileImage() {
      if (this.driverProfile.image)
        return config.BASE_URL + this.driverProfile.image
      else return null
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
