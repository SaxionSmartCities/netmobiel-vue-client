<template>
  <v-container grid-list>
    <v-layout>
      <v-flex>
        <community-button
          icon="event"
          naam="berichten"
          :aantal-berichten="2"
        ></community-button>
      </v-flex>
      <v-flex>
        <community-button
          icon="event"
          naam="gezocht"
          :aantal-berichten="11"
        ></community-button>
      </v-flex>
      <v-flex>
        <community-button
          icon="info"
          naam="competenties"
          :aantal-berichten="2"
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
