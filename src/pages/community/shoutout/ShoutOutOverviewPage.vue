<template>
  <content-pane>
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
          @shoutoutSelected="onShoutoutSelected"
        />
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane'
import GroupedShoutOuts from '@/components/community/GroupedShoutOuts'

export default {
  name: 'ShoutOutOverview',
  components: { GroupedShoutOuts, ContentPane },
  data() {
    return {
      baseLocation: 'Home',
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
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  mounted() {
    this.$store.dispatch('is/fetchShoutOuts', {
      latitude: 52.2224,
      longitude: 5.28248,
    })
  },
  methods: {
    onShoutoutSelected(index) {
      this.$router.push({ name: 'shoutout', params: { id: index } })
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
