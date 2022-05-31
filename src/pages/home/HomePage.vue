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
        this.fetchTripsAndRides()
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
      .then(() => this.fetchTripsAndRides())
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
    fetchTripsAndRides() {
      // ... and also fetch the call-to-actions
      // at most 10 (recent)
      bsStore.actions.fetchUserCtaIncentives({ offset: 0, maxResults: 10 })
      //TODO: How many cards do we want? Get enough to skip the cancelled rides and trips
      const maxCards = 8
      if (this.isDriverOnly || this.isDrivingPassenger) {
        csStore.actions.fetchRides({
          offset: 0,
          maxResults: maxCards,
          since: this.requestTime,
        })
      }
      if (this.isPassengerOnly || this.isDrivingPassenger) {
        isStore.actions.fetchTrips({
          offset: 0,
          maxResults: maxCards,
          since: this.requestTime,
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
            link.to = this.plannerRoute
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
