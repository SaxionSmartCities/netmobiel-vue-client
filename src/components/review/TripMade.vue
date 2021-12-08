<template>
  <v-row>
    <v-col class="pt-0">
      <v-row dense>
        <v-col cols="3">
          <external-user-image
            :managed-identity="driverManagedIdentity"
            :image-size="60"
            :avatar-size="66"
          />
        </v-col>
        <v-col>
          <span class="subtitle-2 text-no-wrap pr-2">
            {{ driverName }}
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
            <h3>Beoordeel jouw rit</h3>
            <span class="body-2">
              Hoe heb jij deze rit ervaren? Geef jouw mening en laat
              {{ driverName }} weten wat jij er van vond.
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
            {{ showChips ? 'Volgende' : 'Beoordeel deze rit' }}
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
import constants from '@/constants/constants'
import * as psStore from '@/store/profile-service'
import ExternalUserImage from '@/components/profile/ExternalUserImage'
import * as UrnHelper from '@/utils/UrnHelper'

export default {
  name: 'TripMade',
  components: { ExternalUserImage },
  props: {
    trip: { type: Object, required: true },
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
    availableCompliments() {
      return psStore.getters.getComplimentTypes
    },
    driverManagedIdentity() {
      const driverId = this.trip?.itinerary.legs[0].driverId
      if (driverId && UrnHelper.isUrn(driverId)) {
        const decodedUrn = UrnHelper.decodeUrn(driverId)
        if (decodedUrn.service === UrnHelper.NETMOBIEL_SERVICE.KEYCLOAK) {
          return decodedUrn.id
        }
      }
      return undefined
    },
    driverName() {
      return this.trip?.itinerary.legs[0].driverName
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
