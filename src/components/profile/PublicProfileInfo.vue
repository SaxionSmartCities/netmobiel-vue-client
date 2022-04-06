<template>
  <v-row>
    <v-col class="shrink">
      <round-user-image
        :profile-image="profileImage"
        :image-size="92"
        :avatar-size="100"
      ></round-user-image>
    </v-col>
    <v-col class="flex-column mt-2">
      <v-row>
        <div class="d-flex flex-column shrink">
          <span v-if="username"> {{ username }}</span>
          <span v-if="address" class="caption">{{ address }}</span>
        </div>
      </v-row>
      <v-row>
        <div class="d-flex flex-column shrink">
          <span v-if="age">Leeftijd: {{ age }} jaar</span>
          <span v-if="interests">Houdt van: {{ interests }}</span>
        </div>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'

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
      const name = []
      if (this.profile?.firstName) {
        name.push(this.profile.firstName)
      }
      if (this.profile?.lastName) {
        name.push(this.profile.lastName)
      }
      return name.join(' ')
    },
    address() {
      return this.profile?.address?.locality
    },
    age() {
      return this.profile?.age
    },
    interests() {
      const interests = this.profile?.interests || []
      return interests.join(', ')
    },
  },
}
</script>
