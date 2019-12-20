<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Berichten</h1>
      </v-col>
    </v-row>
    <v-divider />
    <template v-for="conversation in conversations">
      <conversation-list-item
        :key="conversation.id + '-line'"
        :conversation="conversation"
        @click="showConversation(conversation)"
      />
      <v-divider :key="conversation.id + '-separator'" />
    </template>
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
            {
              content: 'ben je dr nog?',
              sender: 'You',
              timeStamp: moment(),
            },
            {
              content: 'Henk??? HENK!!!! NEEEEEEEE',
              sender: 'You',
              timeStamp: moment(),
            },
            {
              content: 'Jaja ff rustig..',
              sender: 'Henk',
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
    showConversation(conversation) {
      console.log('click', conversation)
      this.$router.push({
        path: `/conversation/${conversation.id}`,
      })
    },
  },
}
</script>

<style lang="scss"></style>
