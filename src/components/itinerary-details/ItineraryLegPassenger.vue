<template>
  <v-row no-gutters>
    <v-col>
      <b>{{ passenger.givenName }} {{ passenger.familyName }}</b> rijdt mee.
      <br />
      <external-user-image
        :managed-identity="passenger.managedIdentity"
        :image-size="60"
        :avatar-size="66"
      />
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
}
</script>

<style lang="scss"></style>
