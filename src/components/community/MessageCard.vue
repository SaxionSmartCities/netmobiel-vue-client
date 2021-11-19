<template>
  <v-card
    elevation="0"
    :class="{ mymessage: isMessageSendByMe, message: !isMessageSendByMe }"
    @click="$emit('click')"
  >
    <v-card-title
      class="d-flex flex-row pa-1"
      :class="{ 'justify-start': !sendByMe, 'justify-end': sendByMe }"
    >
      <external-user-image
        v-if="!sendByMe"
        :managed-identity="user.managedIdentity"
        :image-size="26"
        :avatar-size="30"
      />
      <div class="mx-2">{{ userName }}</div>
      <external-user-image
        v-if="sendByMe"
        :managed-identity="user.managedIdentity"
        :image-size="26"
        :avatar-size="30"
      />
    </v-card-title>
    <v-card-text class="d-flex flex-column py-1">
      <div>{{ message.body }}</div>
      <div
        class="font-italic smaller-font-size"
        :class="{ 'text-right': !sendByMe, 'text-left': sendByMe }"
      >
        {{ timeStamp }}
      </div>
    </v-card-text>
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
    sendByMe: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  computed: {
    timeStamp() {
      return moment(this.message.createdTime)
        .locale('nl')
        .calendar()
    },
    isMessageSendByMe() {
      return this.sendByMe
    },
    profile() {
      return psStore.getters.getProfile
    },
    recipient() {
      // Only the first
      return this.message.envelopes[0].recipient
    },
    recipientName() {
      return this.name(this.recipient)
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
    senderName() {
      return this.name(this.sender)
    },
    user() {
      return this.isMessageSendByMe ? this.recipient : this.sender
    },
    userName() {
      return this.isMessageSendByMe ? this.recipientName : this.senderName
    },
  },
  methods: {
    name(user) {
      return `${user.givenName} ${user.familyName}`.trim()
    },
  },
}
</script>

<style lang="scss">
.mymessage {
  background-color: rgb(225, 237, 239) !important;
  margin-left: 50px;
  color: $color-dark-grey !important;
  border: 1px solid rgba(46, 137, 151, 0.2) !important;
}

.message {
  background-color: rgb(245, 245, 245) !important;
  margin-right: 50px;
  color: $color-dark-grey !important;
  border: 1px solid rgba(74, 74, 74, 0.2) !important;
}
</style>
