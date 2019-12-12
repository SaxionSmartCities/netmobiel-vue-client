<template>
  <v-container>
    <v-row>
      <h1>Berichten</h1>
    </v-row>
    <conversation-list-item
      v-for="conversation in conversations"
      :key="conversation.id"
      :conversation="conversation"
    />
  </v-container>
</template>

<script>
import ConversationListItem from '@/components/community/ConversationListItem.vue'
import moment from 'moment'

export default {
  components: {
    ConversationListItem,
  },
  data: function() {
    return {
      conversations: [
        {
          id: 1,
          sender: 'Henk',
          lastViewed: moment().subtract(1, 'hour'),
          relatedBooking: {
            from: 'Ergens',
            to: 'Ergens anders',
          },
          messages: [
            {
              content: 'Hallo',
              sender: 'Henk',
              timeStamp: moment()
                .subtract(1, 'day')
                .add(2, 'hours'),
            },
            {
              content: 'Hoi',
              sender: 'You',
              timeStamp: moment(),
            },
          ],
        },
        {
          id: 2,
          sender: 'Netmobiel',
          lastViewed: moment().subtract(5, 'hours'),
          messages: [
            {
              content:
                'Geplant onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden. En toen gingen ze koffie drinken en leefden ze nog lang en gelukkig.',
              sender: 'Netmobiel',
              timeStamp: moment().subtract(1, 'day'),
            },
          ],
        },
      ],
    }
  },
  methods: {
    computeUnreadMessages(conversation) {
      console.log(conversation)
      return 2
    },
  },
}
</script>

<style lang="scss"></style>
