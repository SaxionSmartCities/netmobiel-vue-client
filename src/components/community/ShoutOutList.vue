<template>
  <v-row>
    <v-col class="py-0">
      <v-row v-if="shoutouts.length == 0">
        <v-col>
          <em>{{ noItemsLabel }}</em>
        </v-col>
      </v-row>
      <v-row v-for="group in Object.keys(groupedShoutOuts)" v-else :key="group">
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
</template>

<script>
import moment from 'moment'
import GroupedShoutOuts from '@/components/community/GroupedShoutOuts'

export default {
  name: 'ShoutOutList',
  components: { GroupedShoutOuts },
  props: {
    shoutouts: { type: Array, required: true, default: () => [] },
    shouldGroupItems: { type: Boolean, default: true },
    noItemsLabel: { type: String, required: true },
  },
  computed: {
    groupedShoutOuts() {
      return this.groupShoutOuts(this.shoutouts)
    },
  },
  methods: {
    groupShoutOuts(shoutouts) {
      let groupedShoutOuts = {}
      for (const s of this.shoutouts) {
        const date = moment(s.travelTime).format('YYYYMMDD')
        if (!groupedShoutOuts[date]) {
          groupedShoutOuts[date] = []
        }
        groupedShoutOuts[date].push(s)
      }
      return groupedShoutOuts
    },
    onShoutOutSelected(selected) {
      const { id, isUserTraveller } = selected
      this.$emit('shoutoutSelected', { id, isUserTraveller })
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
