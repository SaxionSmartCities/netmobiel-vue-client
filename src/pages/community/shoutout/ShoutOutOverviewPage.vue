<template>
  <content-pane scrollable @low="onLowWater">
    <template #header>
      <tab-bar
        v-if="isDrivingPassenger"
        class="shrink"
        :selected-tab-model="selectedTab"
        @tabChange="(n) => (selectedTab = n)"
      >
        <template #firstTab>
          <!-- Community shout-outs are directed to (potential) drivers -->
          <!-- The selection is made by the backend based on the geo locations of traveller and driver -->
          <span>
            Community
            <sup>{{
              shoutOutPeriod === 'Future'
                ? communityShoutOuts.totalCount
                : pastCommunityShoutOuts.totalCount
            }}</sup>
          </span>
        </template>
        <template #secondTab>
          <!-- My shout-outs are my own calls to the community -->
          <span>
            Mijn oproepen
            <sup>{{
              shoutOutPeriod === 'Future'
                ? myShoutOuts.totalCount
                : myPastShoutOuts.totalCount
            }}</sup>
          </span>
        </template>
      </tab-bar>
    </template>
    <v-row dense>
      <v-col>
        <h1 v-if="isDriverView">Oproepen</h1>
        <h1 v-else>Mijn Oproepen</h1>
      </v-col>
    </v-row>
    <v-row v-if="isPassengerView || supportDriverHistory" dense>
      <v-col>
        <v-radio-group v-model="shoutOutPeriod" class="mt-0" row hide-details>
          <v-radio label="Historie" value="Past"></v-radio>
          <v-radio label="Actueel" value="Future"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row v-if="isDriverView" dense>
      <v-col>
        <p class="mt-0 mb-0">Gezochte ritten in de buurt van mijn:</p>
        <v-radio-group v-model="baseLocation" class="location" row hide-details>
          <v-radio
            label="Woonplaats"
            value="Home"
            :disabled="!profile.address.location"
          ></v-radio>
          <v-radio label="Locatie" value="Here" disabled></v-radio>
          <v-radio label="Land" value="All"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <span v-if="activeShoutOuts.totalCount === 0">
          Er zijn geen oproepen gevonden.
        </span>
        <grouped-card-list
          v-else
          :items="activeShoutOuts.data"
          :get-date="(s) => s.travelTime"
        >
          <template #card="{ item: shoutOut, index }">
            <shout-out
              :index="index"
              :shout-out="shoutOut"
              @shoutOutSelected="onShoutOutSelected"
            />
          </template>
        </grouped-card-list>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane'
import TabBar from '../../../components/common/TabBar'
import { beforeRouteEnter, beforeRouteLeave } from '@/utils/navigation.js'
import constants from '@/constants/constants'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import { coordinatesToGeoLocation } from '@/utils/Utils'
import GroupedCardList from '@/components/common/GroupedCardList'
import ShoutOut from '@/components/community/ShoutOut'
import {
  encodeUrn,
  NETMOBIEL_CLASS,
  NETMOBIEL_SERVICE,
} from '@/utils/UrnHelper'

export default {
  name: 'ShoutOutOverview',
  components: { TabBar, ContentPane, GroupedCardList, ShoutOut },
  beforeRouteEnter: beforeRouteEnter({
    selectedTab: (number) => number || 0,
    baseLocation: (value) => value,
    shoutOutPeriod: (period) => period || 'Future',
  }),
  beforeRouteLeave: beforeRouteLeave({
    selectedTab: (number) => number || 0,
    baseLocation: (value) => value,
    shoutOutPeriod: (period) => period,
  }),
  data() {
    return {
      supportDriverHistory: false,
      driverOnly: true,
      selectedTab: 0,
      baseLocation: '',
      requestTime: null,
      shoutOutPeriod: 'Future',
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    driverId() {
      return encodeUrn(
        NETMOBIEL_SERVICE.KEYCLOAK,
        NETMOBIEL_CLASS.USER,
        this.profile.id
      )
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
    myPastShoutOuts() {
      return isStore.getters.getMyPastShoutOuts
    },
    communityShoutOuts() {
      return isStore.getters.getShoutOuts
    },
    pastCommunityShoutOuts() {
      return isStore.getters.getPastShoutOuts
    },
    activeShoutOuts() {
      if (this.isDriverView) {
        return this.shoutOutPeriod === 'Future'
          ? this.communityShoutOuts
          : this.pastCommunityShoutOuts
      } else {
        return this.shoutOutPeriod === 'Future'
          ? this.myShoutOuts
          : this.myPastShoutOuts
      }
    },
    searchLocation() {
      return this.baseLocation === 'Home'
        ? coordinatesToGeoLocation(this.profile?.address?.location)
        : undefined
    },
  },
  watch: {
    // Whenever the radius radio button changes then refresh the community shout-outs
    // eslint-disable-next-line no-unused-vars
    baseLocation(newValue, oldValue) {
      // console.log(`baseLocation: ${oldValue} --> ${newValue}`)
      this.fetchCommunityShoutOuts()
    },
    // eslint-disable-next-line no-unused-vars
    selectedTab(newValue, oldValue) {
      this.profile.actingRole =
        newValue === 1
          ? constants.PROFILE_ROLE_PASSENGER
          : constants.PROFILE_ROLE_DRIVER
      // No update of profile, too many updates
      // psStore.actions
      //   .updateMyProfile(this.profile)
      //   .then(() => psStore.actions.fetchMyProfile())
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    this.requestTime = moment().format()
    this.selectedTab =
      this.profile.actingRole === constants.PROFILE_ROLE_PASSENGER ? 1 : 0
    if (this.isPassengerOnly || this.isDrivingPassenger) {
      this.fetchMyShoutOuts()
      this.fetchMyPastShoutOuts()
    }
    if (this.isDriverOnly || this.isDrivingPassenger) {
      // Initialize the base location radio
      if (!this.baseLocation) {
        this.baseLocation = this.profile?.address?.location ? 'Home' : 'All'
      }
    }
    isStore.mutations.clearPlanningRequest()
  },
  methods: {
    // All shout-outs before 'now' where the driver was participating somehow.
    // fetchPastCommunityShoutOuts(offset = 0) {
    //   if (offset === 0 || offset < this.pastCommunityShoutOuts.totalCount) {
    //     isStore.actions.fetchShoutOuts({
    //       past: true,
    //       location: this.searchLocation,
    //       sortDir: 'DESC',
    //       until: this.requestTime,
    //       driver: this.driverOnly ? this.driverId : undefined,
    //       offset,
    //       maxResults:
    //         offset === 0 ? 5 : constants.fetchCommunityShoutOutsMaxResults,
    //     })
    //   }
    // },
    // All shout-outs after 'now' that are still open
    fetchCommunityShoutOuts(offset = 0) {
      if (offset === 0 || offset < this.communityShoutOuts.totalCount) {
        isStore.actions.fetchShoutOuts({
          location: this.searchLocation,
          sortDir: 'ASC',
          since: this.requestTime,
          inProgressOnly: true,
          offset,
          maxResults: constants.fetchCommunityShoutOutsMaxResults,
        })
      }
    },
    // All shout-outs before 'now' issued by me
    fetchMyPastShoutOuts(offset = 0) {
      // Choose the initial value large enough! Otherwise no scroll event will occur.
      if (offset === 0 || offset < this.myPastShoutOuts.totalCount) {
        isStore.actions.fetchMyShoutOutTripPlans({
          past: true,
          sortDir: 'DESC',
          until: this.requestTime,
          offset,
          maxResults: offset === 0 ? 5 : constants.fetchMyShoutOutsMaxResults,
        })
      }
    },
    // All shout-outs after 'now' issued by me
    fetchMyShoutOuts(offset = 0) {
      // For now: all shout-outs, in progress or fulfilled
      if (offset === 0 || offset < this.myShoutOuts.totalCount) {
        isStore.actions.fetchMyShoutOutTripPlans({
          sortDir: 'ASC',
          since: this.requestTime,
          offset,
          maxResults: constants.fetchMyShoutOutsMaxResults,
        })
      }
    },
    onShoutOutSelected(selected) {
      if (this.isDriverView) {
        // The driver view of the shout-out
        isStore.mutations.setSelectedShoutOut(null)
        this.$router.push({
          name: 'shoutOutDriver',
          params: {
            shoutOutId: selected.shoutOut.planRef,
          },
        })
      } else {
        // The passenger view of the shout-out is a trip plan as all other
        isStore.mutations.setSelectedTripPlan(null)
        this.$router.push({
          name: 'shoutOutPassenger',
          params: { shoutOutId: selected.shoutOut.planRef },
        })
      }
    },
    formatDate(date) {
      return date ? moment(date).locale('nl').format('dddd D MMMM') : ''
    },
    onLowWater() {
      if (this.isPassengerView) {
        if (this.shoutOutPeriod === 'Future') {
          this.fetchMyShoutOuts(this.myShoutOuts.data.length)
        } else {
          this.fetchMyPastShoutOuts(this.myPastShoutOuts.data.length)
        }
      } else if (this.isDriverView) {
        if (this.shoutOutPeriod === 'Future') {
          this.fetchCommunityShoutOuts(this.communityShoutOuts.data.length)
        }
      }
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
