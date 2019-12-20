<template>
  <v-card
    outlined
    :class="{ mymessage: isMessageSendByMe, message: !isMessageSendByMe }"
  >
    <v-card-title>
      {{ message.content }}
    </v-card-title>
    <v-card-subtitle class="text-right">
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
  },
  computed: {
    timeStamp: function() {
      return moment(this.message.timeStamp).format('HH:mm')
    },
    isMessageSendByMe: function() {
      return this.message.sender === 'You'
    },
  },
  mounted: function() {
    console.log(this.message)
  },
}
</script>

<style>
.mymessage {
  background-color: red !important;
  margin-left: 50px;
}

.message {
  background-color: green !important;
  margin-right: 50px;
}
</style>
