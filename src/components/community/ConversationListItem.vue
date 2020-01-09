<template>
  <v-row @click="$emit('click')">
    <v-col cols="2">
      <v-img class="profileimage" :src="require('@/assets/profile_img.png')" />
    </v-col>
    <v-col cols="8">
      <v-row dense>
        <v-col>
          {{ conversation.sender }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="text-truncate body-2">
          {{ conversation.messages[0].content }}
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="2" class="overline">
      <!-- <v-row dense>
        <v-col> {{ printableDate }}</v-col>
      </v-row> -->
      <v-row dense>
        <v-col just>
          <round-badge :value="unreadMessages"></round-badge>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import RoundBadge from '@/components/common/RoundBadge.vue'
import moment from 'moment'

export default {
  name: 'ConversationList',
  components: {
    RoundBadge,
  },
  props: {
    conversation: {
      type: Object,
      required: true,
    },
  },
  computed: {
    printableDate: function() {
      return moment(this.conversation.messages[0].timeStamp)
        .locale('nl')
        .calendar()
    },
    unreadMessages: function() {
      return 4
    },
  },
}
</script>

<style lang="scss"></style>
