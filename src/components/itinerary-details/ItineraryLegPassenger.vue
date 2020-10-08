<template>
  <v-row no-gutters>
    <v-col>
      <b>{{ passenger.givenName }} {{ passenger.familyName }}</b> rijdt mee.
      <br />
      <round-user-image
        :image-size="60"
        :avatar-size="66"
        :profile-image="passengerImage"
      />
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import * as psStore from '@/store/profile-service'

export default {
  name: 'ItineraryLegPassenger',
  components: { RoundUserImage },
  props: {
    passenger: { type: Object, required: true },
  },
  computed: {
    passengerImage() {
      const image = psStore.getters.getExternalUser?.profile?.image
      return image ? `https://api.netmobiel.eu/gwapi/acc/${image}` : null
    },
  },
  mounted() {
    psStore.actions.fetchUserProfile({
      profileId: this.passenger.managedIdentity,
    })
  },
}
</script>

<style lang="scss"></style>
