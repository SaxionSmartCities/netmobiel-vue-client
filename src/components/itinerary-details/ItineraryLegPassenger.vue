<template>
  <v-row no-gutters>
    <v-col>
      <b>{{ passenger.givenName }} {{ passenger.familyName }}</b> rijdt mee.
      <br />
      <round-user-image :image-size="60" :avatar-size="66"></round-user-image>
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'

export default {
  name: 'ItineraryLegPassenger',
  components: { RoundUserImage },
  props: {
    passenger: { type: Object, required: true },
  },
}
</script>

<style lang="scss"></style>
