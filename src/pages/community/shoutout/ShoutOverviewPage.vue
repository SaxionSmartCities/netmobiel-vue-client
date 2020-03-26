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
    <v-row v-for="(shoutout, index) in getShoutOuts" :key="index">
      <v-col>
        <shout-out
          :shoutout="shoutout"
          @shoutoutSelected="onShoutoutSelected"
        ></shout-out>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import ShoutOut from '@/components/community/ShoutOut'
import { mapGetters } from 'vuex'

export default {
  name: 'Shoutouts',
  components: { ShoutOut, ContentPane },
  data() {
    return {
      baseLocation: 'Home',
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
      latitude: 52.298417,
      longitude: 6.749157,
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
