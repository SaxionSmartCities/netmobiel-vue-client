<template>
  <content-pane>
    <v-row align="center">
      <v-flex>
        <community-button
          forward="/community"
          icon="fa-comments"
          naam="berichten"
          :aantal-berichten="2"
        ></community-button>
      </v-flex>
      <v-flex>
        <community-button
          icon="fa-map"
          naam="gezocht"
          :aantal-berichten="11"
        ></community-button>
      </v-flex>
    </v-row>
    <v-row>
      <v-flex>
        <community-button
          icon="fa-trophy"
          naam="competenties"
          disabled="true"
        ></community-button>
      </v-flex>
      <v-flex>
        <community-button
          icon="fa-gift"
          naam="rewards"
          disabled="true"
        ></community-button>
      </v-flex>
    </v-row>
    <v-row>
      <v-flex>
        <community-button
          icon="fa-bullseye"
          naam="doelen"
          disabled="true"
        ></community-button>
      </v-flex>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import CommunityButton from '@/components/community/CommunityButton.vue'
export default {
  components: {
    CommunityButton: CommunityButton,
    ContentPane,
  },
}
</script>
<style scoped></style>
