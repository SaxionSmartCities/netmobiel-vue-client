<template>
  <v-row dense align="center">
    <v-col class="shrink pr-3 mb-2">
      <round-user-image
        :profile-image="account.image"
        :image-size="54"
        :avatar-size="60"
      />
    </v-col>
    <v-col>
      <span class="body-1 font-weight-medium">
        {{ `${account.firstName} ${account.lastName}` }}
      </span>
      <br />
      <span class="body-2 grey--text">
        {{ account.address && account.address.locality }}
      </span>
    </v-col>
    <v-col class="shrink">
      <v-icon v-if="managed" large color="button"> check </v-icon>
      <v-icon v-else large @click="$emit('select', account)">
        add_circle_outline
      </v-icon>
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'

export default {
  name: 'AccountItem',
  components: { RoundUserImage },
  props: {
    account: { type: Object, required: true },
    managed: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped></style>
