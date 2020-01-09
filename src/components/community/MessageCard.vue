<template>
  <v-card
    elevation="0"
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

<style lang="scss">
.mymessage {
  background-color: #dae9eb !important;

  margin-left: 50px;
}

.message {
  background-color: $color-white-grey !important;
  margin-right: 50px;
}
</style>
