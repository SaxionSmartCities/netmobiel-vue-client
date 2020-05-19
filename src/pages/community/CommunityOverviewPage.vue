<template>
  <content-pane>
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          forward="inbox"
          icon="fa-comments"
          naam="Berichten"
          :aantal-berichten="2"
        ></community-button>
      </v-col>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-map"
          forward="shoutouts"
          naam="Oproepen"
          :aantal-berichten="shoutOutsTotalCount"
        ></community-button>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-trophy"
          naam="Competenties"
          disabled="true"
        ></community-button>
      </v-col>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-gift"
          naam="Rewards"
          disabled="true"
        ></community-button>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-bullseye"
          naam="doelen"
          disabled="true"
        ></community-button>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import CommunityButton from '@/components/community/CommunityButton.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    CommunityButton: CommunityButton,
    ContentPane,
  },
  computed: {
    ...mapGetters({ shoutOutsTotalCount: 'is/getShoutOutsTotalCount' }),
  },
  mounted() {
    this.$store.dispatch('is/fetchShoutOuts', {
      maxResults: 0,
    })
  },
}
</script>
<style scoped></style>
