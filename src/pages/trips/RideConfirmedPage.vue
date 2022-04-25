<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Rit beoordeling</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span class="body-2">
          Je gaat deze rit bevestigen. Hoe heb jij de rit ervaren? Geef je
          mening en laat
          <strong>{{ passengerName }}</strong> weten wat jij er van vond.
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
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'RideConfirmedPage',
  components: { ContentPane },
  props: {
    rideId: { type: String, required: true, default: '' },
  },
  data() {
    return {
      compliments: [],
      reviewMessage: '',
      showChips: true,
    }
  },
  computed: {
    ride() {
      return csStore.getters.getSelectedRide
    },
    confirmedBooking() {
      return this.ride?.bookings?.find(
        (b) => b.state.toUpperCase() === 'CONFIRMED'
      )
    },
    passengerManagedIdentity() {
      return this.confirmedBooking?.passenger?.managedIdentity
    },
    passenger() {
      return this.passengerManagedIdentity
        ? psStore.getters.getPublicUsers.get(this.passengerManagedIdentity)
        : undefined
    },
    passengerName() {
      return (
        [
          this.passenger?.profile.firstName || '',
          this.passenger?.profile.lastName || '',
        ]
          .join(' ')
          .trim() || 'Onbekende passagier'
      )
    },
    availableCompliments() {
      const driverTypes = psStore.getters.getComplimentTypes
      // Remove the compliment types that are driver-only
      return driverTypes.filter((ct) => ct !== 'NICE_CAR')
    },
    myComplimentSet() {
      return this.passenger?.compliments?.data.find(
        (c) => c.context === this.ride?.rideRef
      )
    },
    myReview() {
      return this.passenger?.reviews?.data.find(
        (r) => r.context === this.ride?.rideRef
      )
    },
  },
  watch: {
    passengerManagedIdentity() {
      this.fetchData()
    },
    myComplimentSet(newValue) {
      this.compliments = newValue?.compliments || []
    },
    myReview(newValue) {
      this.reviewMessage = newValue?.review || ''
    },
  },
  created() {
    // Once the trip is confirmed, it becomes less mutable. No back possible then.
    // That is why the next page (review complete) has no back button.
    uiStore.mutations.showBackButton()
  },
  mounted() {
    psStore.actions.fetchComplimentTypes()
    csStore.actions.fetchRide({ id: this.rideId })
    this.fetchData()
  },
  methods: {
    fetchData() {
      if (this.passengerManagedIdentity) {
        psStore.actions.fetchPublicProfile({
          profileId: this.passengerManagedIdentity,
        })
        psStore.actions.fetchUserCompliments({
          receiverId: this.passengerManagedIdentity,
        })
        psStore.actions.fetchUserReviews({
          receiverId: this.passengerManagedIdentity,
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
      csStore.actions.confirmBookedRide({
        id: this.confirmedBooking.bookingRef,
      })
      const receiver = {
        id: this.passengerManagedIdentity,
      }
      psStore.actions.addUserCompliments({
        receiver,
        context: this.ride.rideRef,
        compliments: this.compliments,
      })
      if (this.reviewMessage) {
        psStore.actions.addUserReview({
          receiver,
          context: this.ride.rideRef,
          review: this.reviewMessage,
        })
      }
      this.$router.push({
        name: 'tripReviewedPage',
        params: { otherRole: 'passenger' },
      })
    },
    removeReview() {
      if (this.myReview?.id) {
        psStore.actions.removeUserReview({
          receiverId: this.passengerManagedIdentity,
          reviewId: this.myReview.id,
        })
      }
      if (this.myComplimentSet?.id) {
        psStore.actions.removeUserCompliments({
          receiverId: this.passengerManagedIdentity,
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
