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
      <v-row class="mt-3">
        <v-btn depressed color="button" rounded small>
          <v-icon>add</v-icon>
          Toevoegen als vriend
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import config from '@/config/config'
import moment from 'moment'

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
      if (this.profile?.image) return config.BASE_URL + this.profile.image
      else return null
    },
    username() {
      if (!this.profile?.firstName) return 'Onbekende gebruiker'
      else return this.profile.firstName + ' ' + this.profile.lastName
    },
    address() {
      return this.profile?.address?.locality || 'Onbekend adres'
    },
    age() {
      return this.profile?.dateOfBirth
        ? moment().diff(moment(this.profile.dateOfBirth), 'years', false) +
            ' jaar'
        : 'Leeftijd onbekend'
    },
    interests() {
      const interests = this.profile?.interests || []
      return interests.length > 0 ? interests.join(', ') : 'Geen interesses'
    },
  },
}
</script>
