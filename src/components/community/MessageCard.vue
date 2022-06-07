<template>
  <v-card
    elevation="0"
    :class="{
      mymessage: isMessageSendByMe,
      message: !isMessageSendByMe,
    }"
    @click="$emit('click')"
  >
    <v-row class="d-flex flex-row align-center" dense>
      <v-col v-if="!isMessageSendByMe" class="flex-grow-0 mx-1">
        <external-user-image
          :managed-identity="user.managedIdentity"
          :image-size="30"
          :avatar-size="34"
        />
      </v-col>
      <v-col class="flex-grow-1 mx-1">
        <v-card-subtitle
          class="d-flex flex-row px-0 pt-0 pb-0 text-subtitle-2 font-weight-bold"
          :class="{
            'justify-start': !isMessageSendByMe,
            'justify-end': isMessageSendByMe,
          }"
        >
          <v-icon v-if="isMessageSendByMe">outgoing_mail</v-icon>
          <div>{{ userName }}</div>
          <v-icon v-if="!isMessageSendByMe">outgoing_mail</v-icon>
        </v-card-subtitle>
        <v-card-text class="pa-0">
          <div>{{ message.body }}</div>
          <div class="font-italic smaller-font-size text-right mt-n1">
            {{ timeStamp }}
          </div>
        </v-card-text>
      </v-col>
      <v-col v-if="isMessageSendByMe" class="flex-grow-0 mx-1">
        <external-user-image
          :managed-identity="user.managedIdentity"
          :image-size="30"
          :avatar-size="34"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import moment from 'moment'
import * as psStore from '@/store/profile-service'
import constants from '@/constants/constants'
import ExternalUserImage from '@/components/profile/ExternalUserImage'

export default {
  components: { ExternalUserImage },
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    timeStamp() {
      return moment(this.message.createdTime).locale('nl').calendar()
    },
    isMessageSendByMe() {
      return this.message.sender?.managedIdentity === this.profile.id
    },
    recipient() {
      // Show only the first recipient. Multiple can happen with shout-outs.
      return this.message.envelopes[0].recipient
    },
    sender() {
      return this.message.sender
        ? this.message.sender
        : {
            managedIdentity: constants.SYSTEM_IDENTITY,
            givenName: '',
            familyName: constants.SYSTEM_NAME,
          }
    },
    user() {
      return this.isMessageSendByMe ? this.recipient : this.sender
    },
    userName() {
      return this.name(this.user)
    },
  },
  methods: {
    name(user) {
      return `${user.givenName} ${user.familyName}`.trim()
    },
  },
}
</script>

<style lang="scss" scoped>
.mymessage {
  background-color: rgb(225, 237, 239) !important;
  margin-left: 50px;
  color: $color-dark-grey !important;
  border: 1px solid rgba(46, 137, 151, 0.2);
}

.message {
  background-color: rgb(245, 245, 245) !important;
  margin-right: 50px;
  color: $color-dark-grey !important;
  border: 1px solid rgba(74, 74, 74, 0.2);
}
</style>
