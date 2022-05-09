<template>
  <v-row no-gutters>
    <v-col class="clickable-item" @click="onClickPassenger">
      <v-row dense class="mt-1 align-center">
        <v-col class="shrink">
          <external-user-image
            :managed-identity="passenger.managedIdentity"
            :image-size="54"
            :avatar-size="60"
          />
        </v-col>
        <v-col class="text-center">
          <v-btn small rounded depressed color="button"> Bekijk Profiel </v-btn>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <b>{{ passenger.givenName }} {{ passenger.familyName }}</b> rijdt mee.
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ExternalUserImage from '@/components/profile/ExternalUserImage'

export default {
  name: 'ItineraryLegPassenger',
  components: { ExternalUserImage },
  props: {
    passenger: { type: Object, required: true },
  },
  methods: {
    onClickPassenger() {
      this.$router.push({
        name: 'userProfile',
        params: {
          profileId: this.passenger.managedIdentity,
        },
      })
    },
  },
}
</script>

<style lang="scss"></style>
