<template>
  <content-pane wrap>
    <v-row wrap>
      <v-flex>
        <community-button
          class="mx-auto"
          forward="/community"
          icon="fa-comments"
          naam="berichten"
          :aantal-berichten="2"
        ></community-button>
      </v-flex>
      <v-flex>
        <community-button
          class="mx-auto"
          icon="fa-map"
          naam="gezocht"
          :aantal-berichten="11"
        ></community-button>
      </v-flex>
    </v-row>
    <v-row>
      <v-flex>
        <community-button
          class="mx-auto"
          icon="fa-trophy"
          naam="competenties"
          disabled="true"
        ></community-button>
      </v-flex>
      <v-flex>
        <community-button
          class="mx-auto"
          icon="fa-gift"
          naam="rewards"
          disabled="true"
        ></community-button>
      </v-flex>
    </v-row>
    <v-row>
      <v-flex>
        <community-button
          class="mx-auto"
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
