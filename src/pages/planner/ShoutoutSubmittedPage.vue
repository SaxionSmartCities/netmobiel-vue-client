<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Je oproep is verstuurd 🎉</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        Oproepen vind je terug onder de tab 'Community'.
      </v-col>
    </v-row>
    <v-row class="mb-2">
      <v-col>
        <shout-out
          :shoutout="shoutout"
          :btn-text="'Bekijk shoutout'"
          :is-mine="true"
          @shoutoutSelected="onShoutoutSelected"
        ></shout-out>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- <v-btn block rounded depressed class="my-3 button" to="/shoutouts">
          Bekijk je oproepen
        </v-btn> -->
        <v-btn
          block
          rounded
          depressed
          outlined
          color="primary"
          to="/modeSelection"
        >
          Plan een nieuwe rit
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ShoutOut from '@/components/community/ShoutOut'

export default {
  name: 'ShoutoutSubmittedPage',
  components: { ContentPane, ShoutOut },
  props: {
    shoutout: { type: Object, required: true },
  },
  methods: {
    onShoutoutSelected() {
      this.$router.push('/shoutouts')
    },
  },
}
</script>

<style lang="scss"></style>
