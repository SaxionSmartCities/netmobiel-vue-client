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
    <grouped-shout-outs :label="label" :shoutouts="getShoutOuts" />
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import GroupedShoutOuts from '@/components/community/GroupedShoutOuts'
import { mapGetters } from 'vuex'

export default {
  name: 'Shoutouts',
  components: { GroupedShoutOuts, ContentPane },
  data() {
    return {
      baseLocation: 'Home',
      label: 'Morgen',
    }
  },
  computed: {
    ...mapGetters({
      getShoutOuts: 'is/getShoutOuts',
    }),
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
      this.$router.push({
        name: 'shoutout',
        params: { id: index },
      })
    },
  },
}
</script>

<style scoped></style>
