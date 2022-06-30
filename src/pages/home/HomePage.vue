<template>
  <content-pane>
    <v-row dense align="center">
      <v-col cols="3" class="mr-2">
        <round-user-image
          :image-size="86"
          :avatar-size="80"
          :profile-image="profileImage"
        />
      </v-col>
      <v-col>
        <h3>
          {{ timeOfDayGreeting }},
          {{ fullName }}
        </h3>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <span>
          Welkom bij Netmobiel, dé mobiliteitsapp van de Achterhoek en
          omstreken.
        </span>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-btn large rounded block outlined color="primary" to="/howTo">
          Hoe werkt het?
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="updateMessages.length > 0" dense>
      <v-col>
        <h4 class="netmobiel">Updates</h4>
        <v-carousel
          cycle
          height="284"
          :show-arrows="false"
          hide-delimiter-background
          light
        >
          <v-carousel-item v-for="msg in updateMessages" :key="msg.id">
            <update-card :update-message="msg" card-style="height: 240px" />
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row
      v-if="validatingTrips.length > 0 || validatingRides.length > 0"
      dense
    >
      <v-col>
        <h4 class="netmobiel">Actielijst</h4>
      </v-col>
    </v-row>
    <v-row
      v-if="validatingTrips.length > 0 || validatingRides.length > 0"
      dense
    >
      <v-col>
        <v-row v-for="trip in validatingTrips" :key="trip.id" xs12 dense>
          <v-col>
            <travel-card
              :trip-id="trip.id"
              :trip-state="trip.state"
              :itinerary="trip.itinerary"
              class="trip-card"
              @on-trip-selected="onTripSelected"
            />
          </v-col>
        </v-row>
        <v-row v-for="ride in validatingRides" :key="ride.id" xs12>
          <v-col>
            <ride-card :ride="ride" @rideSelected="onRideSelected" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-if="!isDrivingPassenger">
        <h4 class="netmobiel">Jouw ritten</h4>
      </v-col>
      <v-col v-else>
        <h4 class="netmobiel">Jouw autoritten</h4>
      </v-col>
    </v-row>
    <v-row v-if="isDriverOnly || isDrivingPassenger" dense>
      <v-col v-if="rides.length === 0">
        <span class="font-italic"> Je hebt nog geen autoritten gepland. </span>
      </v-col>
      <v-col v-else>
        <v-row v-for="ride in rides" :key="ride.id" xs12>
          <v-col>
            <ride-card :ride="ride" @rideSelected="onRideSelected" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-if="isDrivingPassenger">
        <h4 class="netmobiel">Jouw ritten</h4>
      </v-col>
    </v-row>
    <v-row v-if="isPassengerOnly || isDrivingPassenger" dense>
      <v-col v-if="trips.length === 0">
        <span class="font-italic"> Je hebt nog geen ritten gepland. </span>
      </v-col>
      <v-col v-else>
        <v-row v-for="trip in trips" :key="trip.id" xs12 dense>
          <v-col>
            <travel-card
              :trip-id="trip.id"
              :trip-state="trip.state"
              :itinerary="trip.itinerary"
              class="trip-card"
              @on-trip-selected="onTripSelected"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="rides.length === 0 && trips.length === 0">
      <v-col>
        <v-btn large rounded block depressed color="button" :to="plannerRoute">
          Direct aan de slag!
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-btn
          large
          rounded
          block
          outlined
          color="primary"
          to="/tripsOverviewPage"
        >
          Bekijk alle activiteiten
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import TravelCard from '@/components/cards/TravelCard.vue'
import RideCard from '@/components/cards/RideCard.vue'
import UpdateCard from '@/components/cards/UpdateCard.vue'
import RoundUserImage from '@/components/common/RoundUserImage'
import moment from 'moment'
import constants from '@/constants/constants'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import * as bsStore from '@/store/banker-service'

export default {
  components: {
    ContentPane,
    TravelCard,
    RideCard,
    UpdateCard,
    RoundUserImage,
  },
  data() {
    return {
      requestTime: null,
      surveyInvitationIssued: false,
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    fullName() {
      const { firstName, lastName } = this.profile
      return `${firstName || ''} ${lastName || ''}`.trim()
    },
    rides() {
      return csStore.getters.getPlannedRides.data
        .filter((ride) => ride.state !== 'CANCELLED')
        .slice(0, 2)
    },
    trips() {
      return isStore.getters.getPlannedTrips.data
        .filter((trip) => trip.state !== 'CANCELLED')
        .slice(0, 2)
    },
    validatingTrips() {
      return isStore.getters.getValidatingTrips.data
    },
    validatingRides() {
      return csStore.getters.getValidatingRides.data
    },
    timeOfDayGreeting() {
      let currentHour = moment().format('HH')

      if (currentHour < 12) {
        return 'Goedemorgen'
      } else if (currentHour < 18) {
        return 'Goedemiddag'
      } else {
        return 'Goedenavond'
      }
    },
    profileImage() {
      return this.profile.image
    },
    isPassengerOnly() {
      return this.profile.userRole === constants.PROFILE_ROLE_PASSENGER
    },
    isDriverOnly() {
      return this.profile.userRole === constants.PROFILE_ROLE_DRIVER
    },
    isDrivingPassenger() {
      return this.profile.userRole === constants.PROFILE_ROLE_BOTH
    },
    plannerRoute() {
      let newRoute = ''
      if (this.isPassengerOnly) {
        newRoute = '/search'
      } else if (this.isDriverOnly) {
        newRoute = '/plan'
      } else {
        newRoute = '/modeSelection'
      }
      return newRoute
    },
    surveyInteraction() {
      return psStore.getters.getSurveyInteraction
    },
    ctaIncentives() {
      return bsStore.getters.getCtaIncentives.data.filter(
        (inc) =>
          inc.category !== 'CARPOOL' ||
          this.isDriverOnly ||
          this.isDrivingPassenger
      )
    },
    updateMessages() {
      // Remove the survey CTA until more data has arrived
      // Also remove Survey CTA if submit time is already set (survey reward might take some time to process,
      // it is asynchronous in the backend)
      return this.ctaIncentives
        .filter(
          (inc) =>
            inc.category !== 'SURVEY' ||
            (this.surveyInteraction != null &&
              !this.surveyInteraction.submitTime)
        )
        .map((inc) => {
          return {
            id: inc.code,
            title: inc.ctaTitle,
            content: inc.ctaBody,
            link: this.createUpdateMessageLink(inc),
          }
        })
    },
  },
  watch: {
    profile(newProfile, oldProfile) {
      if (newProfile.userRole !== oldProfile.userRole) {
        this.fetchUserContent()
      }
    },
    ctaIncentives() {
      if (this.ctaIncentives.find((inc) => inc.category === 'SURVEY') != null) {
        // There is still a survey incentive.Unless we already have a survey interaction,
        // make a survey invitation. The survey completed page will reset the internal cache.
        if (this.surveyInteraction == null && !this.surveyInvitationIssued) {
          this.surveyInvitationIssued = true
          psStore.actions
            .createSurveyInvitation()
            .then((surveyUrn) => {
              if (surveyUrn) {
                psStore.actions.fetchSurvey(surveyUrn)
              }
            })
            .catch(() => (this.surveyInvitationIssued = false))
        }
      }
    },
  },
  mounted() {
    this.requestTme = moment().format()
    // At least one main page where the profile is always refreshed
    psStore.actions
      .fetchMyProfile()
      .then(() => this.fetchUserContent())
      .catch((status) => {
        if (status === 404) {
          // Should not happen
        } else if (status >= 500) {
          // Gateway/server trouble or not found
          return uiStore.actions.queueErrorNotification(
            'De Netmobiel server is momenteel niet beschikbaar, probeer het later opnieuw'
          )
        }
      })
  },
  methods: {
    fetchUserContent() {
      // Fetch trips, rides and also fetch the call-to-actions
      // at most 10 (recent)
      // Do not set the incentive page to empty: too much GUi flashes
      bsStore.actions
        .fetchUserCtaIncentives({ offset: 0, maxResults: 10 })
        .then(() => {
          // If there are still incentive to show, then send an event to mark the view
          // We use the fresh fetch to get the correct count, instead of a transitory value
          if (this.ctaIncentives.length > 0) {
            psStore.mutations.addUserEvent({
              path: this.$route.path,
              event: 'CTA_IN_VIEW',
              arguments: `size=${this.ctaIncentives.length}`,
            })
          }
        })
      this.requestTime = moment().format()
      const maxCards = 2
      if (this.isDriverOnly || this.isDrivingPassenger) {
        csStore.actions.fetchPlannedRides({
          offset: 0,
          maxResults: maxCards,
          since: this.requestTime,
          skipCancelled: true,
        })
        csStore.actions.fetchValidatingRides({
          offset: 0,
          maxResults: 1,
        })
      }
      if (this.isPassengerOnly || this.isDrivingPassenger) {
        isStore.actions.fetchPlannedTrips({
          offset: 0,
          maxResults: maxCards,
          since: this.requestTime,
          skipCancelled: true,
        })
        isStore.actions.fetchValidatingTrips({
          offset: 0,
          maxResults: 1,
        })
      }
    },
    onTripSelected(selected) {
      //TODO Use trips from the list (less detailed, then immediate result on page change)
      isStore.mutations.setSelectedTrip(null)
      this.$router.push({
        name: 'tripDetailPage',
        params: { tripId: String(selected.tripId) },
      })
    },
    onRideSelected(id) {
      this.$router.push({
        name: 'rideDetailPage',
        params: { rideId: id },
      })
    },
    createUpdateMessageLink(incentive) {
      let link
      if (incentive.ctaButtonLabel) {
        link = {
          label: incentive.ctaButtonLabel,
        }
        switch (incentive.ctaButtonAction) {
          case 'plan-ride':
            link.to = '/plan'
            break
          case 'onboarding-profile':
            link.to = '/onboardingPage'
            break
          case 'start-survey':
            if (this.surveyInteraction != null) {
              link.href = this.surveyInteraction.surveyUrl
              link.notification = () =>
                psStore.actions.markSurveyRedirection(
                  this.surveyInteraction.urn
                )
            }
            break
        }
      }
      return link
    },
  },
}
</script>

<style lang="scss"></style>
