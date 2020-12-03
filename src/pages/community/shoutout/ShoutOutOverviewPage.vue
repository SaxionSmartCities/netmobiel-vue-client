<template>
  <content-pane>
    <template v-slot:header>
      <tab-bar
        v-if="showTabs"
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template v-slot:firstTab>
          <span>
            Community
            <sup>{{ communityShoutOuts.length }}</sup>
          </span>
        </template>
        <template v-slot:secondTab>
          <span>
            Mijn oproepen
            <sup>{{ myShoutOuts.length }}</sup>
          </span>
        </template>
      </tab-bar>
    </template>
    <v-row
      v-if="userRole === 'driver' || (userRole === 'both' && selectedTab === 0)"
    >
      <v-col class="py-0">
        <v-row>
          <v-col>
            <h3>Community oproepen</h3>
            <p class="mt-2 mb-0">Gezochte ritten in de buurt van mijn:</p>
            <v-radio-group v-model="baseLocation" class="location" row>
              <v-radio label="Woonplaats" value="Home" selected></v-radio>
              <v-radio label="Huidige locatie" value="Here" disabled></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <shout-out-list
          :shoutouts="communityShoutOuts"
          no-items-label="Er zijn op dit moment opgeslagen oproepen in de buurt."
          @shoutoutSelected="onShoutOutSelected"
        />
      </v-col>
    </v-row>
    <v-row
      v-if="
        userRole === 'passenger' || (userRole === 'both' && selectedTab === 1)
      "
    >
      <v-col class="py-0">
        <shout-out-list
          :shoutouts="myShoutOuts"
          no-items-label="U heeft op dit moment geen opgeslagen oproepen."
          @shoutoutSelected="onShoutOutSelected"
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
import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'
import constants from '@/constants/constants'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'ShoutOutOverview',
  components: { TabBar, ShoutOutList, ContentPane },
  data() {
    return {
      selectedTab: 0,
      baseLocation: 'Home',
      communityShoutOuts: [],
    }
  },
  computed: {
    myShoutOuts() {
      const profile = psStore.getters.getProfile
      const listMyShoutOuts = isStore.getters.getMyShoutOuts
      return listMyShoutOuts.map(shoutout => ({
        ...shoutout,
        traveller: profile,
      }))
    },
    proposedRides() {
      return csStore.getters.getProposedRides
    },
    showTabs() {
      const role = psStore.getters.getProfile.userRole
      return !role || role === constants.PROFILE_ROLE_BOTH
    },
    userRole() {
      return psStore.getters.getProfile.userRole
    },
  },
  watch: {
    proposedRides(proposed) {
      let updatedShoutOuts = []
      for (const s of isStore.getters.getShoutOuts) {
        s.ride = proposed.find(p => {
          return !!p.bookings.find(b => b.passengerTripRef === s.planRef)
        })
        updatedShoutOuts.push(s)
      }
      this.communityShoutOuts = updatedShoutOuts
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  beforeRouteEnter: beforeRouteEnter({
    selectedTab: number => number || 0,
  }),
  beforeRouteLeave: beforeRouteLeave({
    selectedTab: number => number || 0,
    editDepart: editing => editing || false,
  }),
  mounted() {
    const { id, address } = psStore.getters.getProfile
    isStore.actions.fetchShoutOuts({
      latitude: address.location.coordinates[1],
      longitude: address.location.coordinates[0],
    })
    isStore.actions.fetchMyShoutOuts({
      offset: 0,
    })
    // If our role is 'chauffeur' or 'both' fetch any travel proposal we may have.
    if (
      this.userRole == constants.PROFILE_ROLE_DRIVER ||
      this.userRole == constants.PROFILE_ROLE_BOTH
    ) {
      csStore.actions.fetchTravelProposals({
        since: moment().format(),
        driverManagedId: id,
      })
    }
    isStore.mutations.clearPlanningRequest()
  },
  methods: {
    onShoutOutSelected(selected) {
      if (selected.isUserTraveller) {
        this.$router.push({
          name: 'shoutoutpassenger',
          params: { id: selected.id },
        })
      } else {
        this.$router.push({
          name: 'shoutoutdriver',
          params: {
            id: selected.id,
            isMine: selected.isUserTraveller.toString(),
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
