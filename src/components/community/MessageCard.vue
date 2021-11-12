<template>
  <v-card
    elevation="0"
    :class="{ mymessage: isMessageSendByMe, message: !isMessageSendByMe }"
    @click="$emit('click')"
  >
    <v-card-title class="d-flex flex-row pa-1">
      <external-user-image
        :managed-identity="getParticipantIdentity(message.sender)"
        :image-size="26"
        :avatar-size="30"
      />
      <div class="mx-2">{{ getParticipantName(message.sender) }}</div>
    </v-card-title>
    <v-card-text class="d-flex flex-column py-1">
      <div>{{ message.body }}</div>
      <div class="text-right font-italic smaller-font-size">
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
    myContext() {
      if (this.isMessageSendByMe) {
        return this.message.context
      } else {
        return this.message.envelopes.find(
          env => env.recipient.managedIdentity === this.profile.id
        ).context
      }
    },
  },
  methods: {
    getParticipantIdentity(ptcp) {
      return ptcp ? ptcp.managedIdentity : constants.SYSTEM_IDENTITY
    },
    getParticipantName(ptcp) {
      return ptcp
        ? ptcp.givenName + ' ' + ptcp.familyName
        : constants.SYSTEM_NAME
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
