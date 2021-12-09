<template>
  <v-row no-gutters>
    <v-col>
      <external-user-image
        :managed-identity="passenger.managedIdentity"
        :image-size="54"
        :avatar-size="60"
      />
      <br />
      <b>{{ passenger.givenName }} {{ passenger.familyName }}</b> rijdt mee.
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
