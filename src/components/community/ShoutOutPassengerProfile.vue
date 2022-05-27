<template>
  <v-row
    v-if="user"
    dense
    class="mb-2 clickable-item align-center flex-row"
    @click="onClickProfile"
  >
    <v-col class="shrink">
      <external-user-image :managed-identity="user.managedIdentity" />
    </v-col>
    <v-col class="flex-column">
      <p class="font-weight-regular header mb-0">Passagier</p>
      <p class="font-weight-light subtitle-1 mb-0">
        {{ user.givenName }} {{ user.familyName }}
      </p>
      <v-btn small rounded outlined color="primary"> Bekijk Profiel </v-btn>
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
