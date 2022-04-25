<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Rit bevestigd! 🎉</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col> Bedankt voor jouw bevestiging! </v-col>
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
                'compliment-chip-active': isSelected(compliment),
              }"
              :value="compliment"
              @click="addCompliment(compliment)"
            >
              {{ complimentText(compliment) }}
            </v-chip>
          </div>
          <div>
            <v-textarea
              v-model="reviewMessage"
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
          :disabled="
            !(myComplimentSet && myComplimentSet.id) &&
            !(myReview && myReview.id)
          "
          @click="removeReview"
        >
          Beoordeling verwijderen
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
import * as uiStore from '@/store/ui'

export default {
  name: 'TripConfirmedPage',
  components: { ContentPane },
  props: {
    tripId: { type: String, required: true, default: '' },
  },
  data() {
    return {
      compliments: [],
      reviewMessage: '',
      showChips: true,
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
      return this.trip?.itinerary.legs.find((l) => !!l.driverId)
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
    driver() {
      return this.driverManagedIdentity
        ? psStore.getters.getPublicUsers.get(this.driverManagedIdentity)
        : undefined
    },
    myComplimentSet() {
      return this.driver?.compliments?.data.find(
        (c) => c.context === this.trip?.tripRef
      )
    },
    myReview() {
      return this.driver?.reviews?.data.find(
        (r) => r.context === this.trip?.tripRef
      )
    },
  },
  watch: {
    driverManagedIdentity() {
      this.fetchData()
    },
    myComplimentSet(newValue) {
      this.compliments = newValue?.compliments || []
    },
    myReview(newValue) {
      this.reviewMessage = newValue.review || ''
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    psStore.actions.fetchComplimentTypes()
    isStore.actions.fetchTrip({ id: this.tripId })
    this.fetchData()
  },
  methods: {
    fetchData() {
      if (this.driverManagedIdentity) {
        psStore.actions.fetchPublicProfile({
          profileId: this.driverManagedIdentity,
        })
        psStore.actions.fetchUserCompliments({
          receiverId: this.driverManagedIdentity,
        })
        psStore.actions.fetchUserReviews({
          receiverId: this.driverManagedIdentity,
        })
      }
    },
    complimentText(c) {
      return constants.COMPLIMENT_MAPPING[c]
    },
    isSelected(compliment) {
      return this.compliments.includes(compliment)
    },
    addCompliment(compliment) {
      const index = this.compliments.findIndex((c) => c === compliment)
      if (
        this.compliments.length < constants.maxComplimentsAllowed &&
        index === -1
      ) {
        //Not reached the limit of compliments and the compliment is NOT in the list yet.
        this.compliments.push(compliment)
      } else if (
        // Limit reached and the compliment is not in the list.
        // Remove the last compliment selected and add the one selected
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
      isStore.actions.confirmTrip({ id: this.tripId })
      const receiver = {
        id: this.driverManagedIdentity,
      }
      psStore.actions.addUserCompliments({
        receiver,
        context: this.trip.tripRef,
        compliments: this.compliments,
      })
      if (this.reviewMessage) {
        psStore.actions.addUserReview({
          receiver,
          context: this.trip.tripRef,
          review: this.reviewMessage,
        })
      }
      this.$router.push({
        name: 'tripReviewedPage',
        params: { otherRole: 'driver' },
      })
    },
    removeReview() {
      if (this.myReview?.id) {
        psStore.actions.removeUserReview({
          receiverId: this.driverManagedIdentity,
          reviewId: this.myReview.id,
        })
      }
      if (this.myComplimentSet?.id) {
        psStore.actions.removeUserCompliments({
          receiverId: this.driverManagedIdentity,
          complimentId: this.myComplimentSet.id,
        })
      }
      this.reviewMessage = ''
      this.compliments = []
      this.fetchData()
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
