<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Rit bevestigd! 🎉</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Bedankt voor jouw bevestiging!
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span class="body-2">
          Hoe heb jij deze rit ervaren? Geef jouw mening en laat
          <strong>{{ driverName }}</strong> weten wat jij er van vond.
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
          <div>
            <v-textarea
              v-model="inputTextArea"
              class="pt-2"
              placeholder="Beschrijving..."
              outlined
            ></v-textarea>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          block
          large
          depressed
          rounded
          color="button"
          :disabled="compliments.length === 0"
          @click="submitReview"
        >
          Beoordeling opslaan
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          block
          large
          rounded
          outlined
          color="primary"
          to="/tripsOverviewPage"
        >
          Terug naar ritten
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import constants from '@/constants/constants'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import * as UrnHelper from '@/utils/UrnHelper'

export default {
  name: 'TripConfirmedPage',
  components: { ContentPane },
  data() {
    return {
      compliments: [],
      feedbackMessage: '',
      showChips: true,
      inputTextArea: null,
    }
  },
  computed: {
    trip() {
      return isStore.getters.getSelectedTrip
    },
    driverName() {
      return this.leg?.driverName || 'Onbekende chauffeur'
    },
    availableCompliments() {
      return psStore.getters.getComplimentTypes
    },
    leg() {
      return this.trip?.itinerary.legs.find(l => !!l.driverId)
    },
    driverManagedIdentity() {
      const driverId = this.leg?.driverId
      if (driverId && UrnHelper.isUrn(driverId)) {
        const decodedUrn = UrnHelper.decodeUrn(driverId)
        if (decodedUrn.service === UrnHelper.NETMOBIEL_SERVICE.KEYCLOAK) {
          return decodedUrn.id
        }
      }
      return undefined
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
    submitReview() {
      // For each compliment given do a call to the backend
      // Can be changed in the future to a call that possibly accepts array if >1 compliments can be given
      const { id, firstName, lastName } = psStore.getters.getProfile
      const sender = { id, firstName, lastName }
      const receiver = {
        id: this.driverManagedIdentity,
      }
      this.compliments.map(compliment =>
        psStore.actions.addUserCompliment({
          sender,
          receiver,
          complimentType: compliment,
        })
      )
      if (this.feedbackMessage) {
        psStore.actions.addUserReview({
          sender,
          receiver,
          review: this.feedbackMessage,
        })
      }
      this.$router.push({ name: 'tripReviewedPage' })
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
