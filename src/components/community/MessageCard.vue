<template>
  <v-card
    elevation="0"
    :class="{ mymessage: isMessageSendByMe, message: !isMessageSendByMe }"
  >
    <v-card-title class="pa-2">
      {{ message.body }}
    </v-card-title>
    <v-card-subtitle class="text-right px-2 py-1">
      {{ timeStamp }}
    </v-card-subtitle>
  </v-card>
</template>

<script>
import moment from 'moment'

export default {
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
      return moment(this.message.creationTime).format('HH:mm')
    },
    isMessageSendByMe: function() {
      return this.sendByMe
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
