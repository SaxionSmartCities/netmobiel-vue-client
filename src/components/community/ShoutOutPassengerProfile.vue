<template>
  <v-row v-if="user" dense class="mb-2 align-center flex-row">
    <v-col class="shrink">
      <external-user-image :managed-identity="user.managedIdentity" />
    </v-col>
    <v-col class="flex-column">
      <p class="font-weight-regular header mb-0">Passagier</p>
      <p class="font-weight-light subtitle-1 mb-0">
        {{ user.givenName }} {{ user.familyName }}
      </p>
      <v-btn
        v-if="canViewProfile"
        small
        rounded
        outlined
        color="primary"
        @click="onClickProfile"
      >
        Bekijk Profiel
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import ExternalUserImage from '@/components/profile/ExternalUserImage'

export default {
  name: 'ShoutOutPassengerProfile',
  components: { ExternalUserImage },
  props: {
    user: { type: Object, required: false, default: () => undefined },
    canViewProfile: { type: Boolean, required: false, default: true },
  },
  methods: {
    onClickProfile() {
      this.$router.push({
        name: 'userProfile',
        params: {
          profileId: this.user.managedIdentity,
        },
      })
    },
  },
}
</script>
