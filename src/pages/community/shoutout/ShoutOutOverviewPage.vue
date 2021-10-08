<template>
  <content-pane>
    <template v-slot:header>
      <tab-bar
        v-if="isDrivingPassenger"
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template v-slot:firstTab>
          <!-- Community shout-outs are directed to (potential) drivers -->
          <!-- The selection is made by the backend based on the geo locations of traveller and driver -->
          <span>
            Community
            <sup>{{ communityShoutOuts.length }}</sup>
          </span>
        </template>
        <template v-slot:secondTab>
          <!-- My shout-outs are my own calls to the community -->
          <span>
            Mijn oproepen
            <sup>{{ myShoutOuts.length }}</sup>
          </span>
        </template>
      </tab-bar>
    </template>
    <v-row v-if="isDriverView">
      <v-col class="py-0">
        <v-row>
          <v-col>
            <h3>Community oproepen</h3>
            <p class="mt-2 mb-0">Gezochte ritten in de buurt van mijn:</p>
            <v-radio-group v-model="baseLocation" class="location" row>
              <v-radio
                label="Woonplaats"
                value="Home"
                :disabled="!profile.address.location"
              ></v-radio>
              <v-radio label="Huidige locatie" value="Here" disabled></v-radio>
              <v-radio label="Land" value="All"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <shout-out-list
          :shout-outs="communityShoutOuts"
          no-items-label="Er zijn op dit moment geen oproepen gevonden."
          @shoutOutSelected="onShoutOutSelected"
        />
      </v-col>
    </v-row>
    <v-row v-if="isPassengerView">
      <v-col class="py-0">
        <shout-out-list
          :shout-outs="myShoutOuts"
          no-items-label="Je hebt op dit moment geen opgeslagen oproepen."
          @shoutOutSelected="onShoutOutSelected"
        />
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane'
import ShoutOutList from '@/components/community/ShoutOutList'
import TabBar from '../../../components/common/TabBar'
import { beforeRouteEnter, beforeRouteLeave } from '@/utils/navigation.js'
import constants from '@/constants/constants'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import { coordinatesToGeoLocation } from '@/utils/Utils'

export default {
  name: 'ShoutOutOverview',
  components: { TabBar, ShoutOutList, ContentPane },
  data() {
    return {
      selectedTab: 0,
      baseLocation: '',
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    isDriverTab() {
      return this.selectedTab === 0
    },
    isPassengerTab() {
      return this.selectedTab === 1
    },
    isDriverView() {
      return this.isDriverOnly || (this.isDrivingPassenger && this.isDriverTab)
    },
    isPassengerView() {
      return (
        this.isPassengerOnly || (this.isDrivingPassenger && this.isPassengerTab)
      )
    },
    isPassengerOnly() {
      return (
        psStore.getters.getProfile.userRole === constants.PROFILE_ROLE_PASSENGER
      )
    },
    isDriverOnly() {
      return (
        psStore.getters.getProfile.userRole === constants.PROFILE_ROLE_DRIVER
      )
    },
    isDrivingPassenger() {
      return psStore.getters.getProfile.userRole === constants.PROFILE_ROLE_BOTH
    },
    hasHomeLocation() {
      return !!this.profile.address?.location
    },
    /**
     * List my shout-outs. Note that my shout-out is a trip plan with all itineraries offered.
     * A driver can also fetch a shout-out, but that will never contain itineraries (for privacy).
     * A driver can see his own ride, which is also an itinerary.
     */
    myShoutOuts() {
      return isStore.getters.getMyShoutOuts
    },
    communityShoutOuts() {
      return isStore.getters.getShoutOuts
    },
  },
  watch: {
    baseLocation(newValue, oldValue) {
      // console.log(`baseLocation: ${oldValue} --> ${newValue}`)
      this.fetchShoutOuts()
    },
    selectedTab(newValue, oldValue) {
      this.profile.actualRole =
        newValue === 1
          ? constants.PROFILE_ROLE_PASSENGER
          : constants.PROFILE_ROLE_DRIVER
      psStore.actions.updateProfile(this.profile)
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  beforeRouteEnter: beforeRouteEnter({
    selectedTab: number => number || 0,
    baseLocation: value => value,
  }),
  beforeRouteLeave: beforeRouteLeave({
    selectedTab: number => number || 0,
    baseLocation: value => value,
  }),
  mounted() {
    this.selectedTab =
      this.profile.actualRole === constants.PROFILE_ROLE_PASSENGER ? 1 : 0
    csStore.mutations.setProposedRides([])
    isStore.mutations.setMyShoutOuts([])
    isStore.mutations.setShoutOuts([])
    if (this.isPassengerOnly || this.isDrivingPassenger) {
      isStore.actions.fetchMyShoutOutTripPlans({
        offset: 0,
      })
    }
    if (this.isDriverOnly || this.isDrivingPassenger) {
      // Initialize the base location radio
      this.baseLocation = this.profile?.address?.location ? 'Home' : 'All'
      csStore.actions.fetchRideProposals({
        since: moment().format(),
      })
    }
    isStore.mutations.clearPlanningRequest()
  },
  methods: {
    fetchShoutOuts() {
      const location =
        this.baseLocation === 'Home'
          ? coordinatesToGeoLocation(this.profile?.address?.location)
          : undefined
      isStore.actions.fetchShoutOuts({ location })
    },
    onShoutOutSelected(selected) {
      isStore.mutations.setSelectedTripPlan({})
      if (selected.shoutOut.traveller.managedIdentity === this.profile.id) {
        this.$router.push({
          name: 'shoutOutPassenger',
          params: { shoutOutId: selected.shoutOut.planRef },
        })
      } else {
        // Only a driver can see his own proposed ride
        this.$router.push({
          name: 'shoutOutDriver',
          params: {
            shoutOutId: selected.shoutOut.planRef,
            // Is it possible to pass an optional parameter? For now set the default to 'none'
            rideId: selected.proposedRide?.rideRef || 'none',
          },
        })
      }
    },
    formatDate(date) {
      return date
        ? moment(date)
            .locale('nl')
            .format('dddd D MMMM')
        : ''
    },
  },
}
</script>

<style scoped>
.location {
  margin-top: 4px;
  height: 30px;
}
</style>
