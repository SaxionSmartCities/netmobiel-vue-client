<template>
  <v-container grid-list>
    <v-layout wrap>
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
      <v-flex>
        <community-button
          icon="fa-bullseye"
          naam="doelen"
          disabled="true"
        ></community-button>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CommunityButton from '@/components/community/CommunityButton.vue'
export default {
  components: {
    CommunityButton: CommunityButton,
  },
}
</script>
<style scoped></style>
