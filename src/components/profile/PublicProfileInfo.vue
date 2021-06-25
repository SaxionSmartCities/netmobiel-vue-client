<template>
  <v-row>
    <v-col class="shrink">
      <round-user-image
        :profile-image="profileImage"
        :image-size="92"
        :avatar-size="100"
      ></round-user-image>
    </v-col>
    <v-col class="flex-column">
      <v-row>
        <div class="d-flex flex-column shrink">
          <span> {{ username }}</span>
          <span class="caption">{{ address }}</span>
        </div>
        <div class="d-flex flex-column mt-3">
          <span>{{ age }}</span>
          <span>Houdt van: {{ interests }}</span>
        </div>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import config from '@/config/config'
import moment from 'moment'
import { LocalDate, Period } from '@js-joda/core'

export default {
  name: 'PublicProfileInfo',
  components: {
    RoundUserImage,
  },
  props: {
    profile: { type: Object, required: true },
  },
  computed: {
    profileImage() {
      return this.profile?.image
    },
    username() {
      if (!this.profile?.firstName) return 'Onbekende gebruiker'
      else return this.profile.firstName + ' ' + this.profile.lastName
    },
    address() {
      return this.profile?.address?.locality || 'Onbekend adres'
    },
    age() {
      return this.profile?.age
        ? `Leeftijd: ${this.profile.age} jaar`
        : 'Leeftijd onbekend'
    },
    interests() {
      const interests = this.profile?.interests || []
      return interests.length > 0 ? interests.join(', ') : 'Geen interesses'
    },
  },
}
</script>
