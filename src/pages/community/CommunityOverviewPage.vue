<template>
  <content-pane>
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          forward="inbox"
          icon="fa-comments"
          naam="berichten"
          :aantal-berichten="2"
        ></community-button>
      </v-col>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-map"
          forward="shoutouts"
          naam="gezocht"
          :aantal-berichten="11"
        ></community-button>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-trophy"
          naam="competenties"
          disabled="true"
        ></community-button>
      </v-col>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-gift"
          naam="rewards"
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
export default {
  components: {
    CommunityButton: CommunityButton,
    ContentPane,
  },
}
</script>
<style scoped></style>
