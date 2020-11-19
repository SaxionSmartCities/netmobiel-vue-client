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
            <sup>{{ allShoutOuts.length }}</sup>
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
        <v-row v-if="allShoutOuts.length == 0">
          <v-col>
            <em>Er zijn op dit moment opgeslagen oproepen in de buurt.</em>
          </v-col>
        </v-row>
        <v-row
          v-for="group in Object.keys(groupedShoutOuts)"
          v-else
          :key="group"
        >
          <v-col class="py-0">
            <grouped-shout-outs
              :label="formatDate(group)"
              :shoutouts="groupedShoutOuts[group]"
              @shoutoutSelected="onShoutOutSelected"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row
      v-if="
        userRole === 'passenger' || (userRole === 'both' && selectedTab === 1)
      "
    >
      <v-col class="py-0">
        <v-row v-if="myShoutOuts.length == 0">
          <v-col>
            <em>U heeft op dit moment geen opgeslagen oproepen.</em>
          </v-col>
        </v-row>
        <v-row
          v-for="group in Object.keys(groupedMyShoutOuts)"
          v-else
          :key="group"
        >
          <v-col class="py-0">
            <grouped-shout-outs
              :label="formatDate(group)"
              :shoutouts="groupedMyShoutOuts[group]"
              @shoutoutSelected="onShoutOutSelected"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane'
import GroupedShoutOuts from '@/components/community/GroupedShoutOuts'
import TabBar from '../../../components/common/TabBar'
import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'ShoutOutOverview',
  components: { TabBar, GroupedShoutOuts, ContentPane },
  data() {
    return {
      selectedTab: 0,
      baseLocation: 'Home',
    }
  },
  computed: {
    allShoutOuts() {
      return isStore.getters.getShoutOuts
    },
    groupedShoutOuts() {
      return this.groupShoutOuts(this.allShoutOuts)
    },
    myShoutOuts() {
      const profile = psStore.getters.getProfile
      const listMyShoutOuts = isStore.getters.getMyShoutOuts
      return listMyShoutOuts.map(shoutout => ({
        ...shoutout,
        traveller: profile,
      }))
    },
    groupedMyShoutOuts() {
      return this.groupShoutOuts(this.myShoutOuts)
    },
    showTabs() {
      const role = psStore.getters.getProfile.userRole
      return !role || role === 'both'
    },
    userRole() {
      return psStore.getters.getProfile.userRole
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
    const address = psStore.getters.getProfile.address
    isStore.actions.fetchShoutOuts({
      latitude: address.location.coordinates[1],
      longitude: address.location.coordinates[0],
    })
    isStore.actions.fetchMyShoutOuts({
      offset: 0,
    })
    isStore.mutations.clearPlanningRequest()
  },
  methods: {
    groupShoutOuts(shoutouts) {
      let groupedShoutOuts = {}
      shoutouts.map(s => {
        const date = moment(s.travelTime).format('YYYYMMDD')
        if (!groupedShoutOuts[date]) {
          groupedShoutOuts[date] = []
        }
        groupedShoutOuts[date].push(s)
      })
      return groupedShoutOuts
    },
    onShoutOutSelected(selected) {
      this.$router.push({
        name: 'shoutout',
        params: {
          id: selected.id,
          isMine: selected.isUserTraveller.toString(),
        },
      })
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
