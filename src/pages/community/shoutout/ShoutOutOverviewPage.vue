<template>
  <content-pane>
    <template v-slot:header>
      <tab-bar
        v-if="showTabs"
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template v-slot:firstTab>
          <span>Mijn oproepen</span>
        </template>

        <template v-slot:secondTab>
          <span>Community</span>
        </template>
      </tab-bar>
    </template>
    <v-row v-if="selectedTab === 0 || userRole === 'passenger'">
      <v-col>
        <grouped-shout-outs
          label="Mijn shoutouts"
          :shoutouts="myShoutOuts"
          :btn-text="mySoBtnText"
          :my-shout-out="true"
          @shoutoutSelected="onShoutOutSelected"
        />
      </v-col>
    </v-row>
    <template v-if="selectedTab === 1 || userRole === 'driver'">
      <v-row>
        <v-col>
          <h3>Community oproepen</h3>
          <p class="mt-2 mb-0">Gezochte reizen in de buurt van mijn:</p>
          <v-radio-group v-model="baseLocation" class="mt-1" row>
            <v-radio label="Woonplaats" value="Home" selected></v-radio>
            <v-radio label="Huidige locatie" value="Here" disabled></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row v-for="group in Object.keys(groupedShoutOuts)" :key="group">
        <v-col>
          <grouped-shout-outs
            :label="formatDate(group)"
            :shoutouts="groupedShoutOuts[group]"
            :btn-text="communitySoBtnText"
            @shoutoutSelected="onShoutOutSelected"
          />
        </v-col>
      </v-row>
    </template>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane'
import GroupedShoutOuts from '@/components/community/GroupedShoutOuts'
import TabBar from '../../../components/common/TabBar'

export default {
  name: 'ShoutOutOverview',
  components: { TabBar, GroupedShoutOuts, ContentPane },
  data() {
    return {
      selectedTab: 0,
      baseLocation: 'Home',
      communitySoBtnText: 'Rit aanbieden',
      mySoBtnText: 'Bekijk shoutout',
    }
  },
  computed: {
    groupedShoutOuts() {
      const shoutouts = this.$store.getters['is/getShoutOuts']
      let groupedShoutOuts = {}
      shoutouts.map(s => {
        const date = moment(s.departureTime).format('YYYYMMDD')
        if (!groupedShoutOuts[date]) {
          groupedShoutOuts[date] = []
        }
        groupedShoutOuts[date].push(s)
      })
      return groupedShoutOuts
    },
    myShoutOuts() {
      const profile = this.$store.getters['ps/getProfile']
      const listMyShoutOuts = this.$store.getters['is/getMyShoutOuts']
      return listMyShoutOuts.map(shoutout => ({
        ...shoutout,
        traveller: profile,
      }))
    },
    showTabs() {
      const role = this.$store.getters['ps/getProfile'].userRole
      return !role || role === 'both'
    },
    userRole() {
      return this.$store.getters['ps/getProfile'].userRole
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  mounted() {
    this.$store.dispatch('is/fetchShoutOuts', {
      latitude: 52.2224,
      longitude: 5.28248,
    })
    this.$store.dispatch('is/fetchMyShoutOuts', {
      offset: 0,
    })
  },
  methods: {
    onShoutOutSelected({ index, isMine }) {
      console.log('selected shoutout', index, isMine)
      this.$router.push({ name: 'shoutout', params: { id: index, isMine } })
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

<style scoped></style>
