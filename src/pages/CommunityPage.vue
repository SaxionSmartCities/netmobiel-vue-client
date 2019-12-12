<template>
  <v-container>
    <v-row>
      <h1>Berichten</h1>
    </v-row>
    <v-row>
      <v-col
        v-for="conversation in conversations"
        :key="conversation.id"
        cols="12"
      >
        <conversation-card
          :sender="conversation.sender"
          :display-message="conversation.messages[0]"
          :related-booking="
            conversation.relatedBooking !== undefined
              ? conversation.relatedBooking
              : null
          "
          :unread-messages="computeUnreadMessages(conversation)"
        >
        </conversation-card>
      </v-col>
    </v-row>
    <v-row>
      EndOfLijstje
    </v-row>
  </v-container>
</template>

<script>
import ConversationCard from '@/components/community/ConversationCard.vue'
export default {
  components: {
    ConversationCard,
  },
  data: function() {
    return {
      conversations: [
        {
          id: 1,
          sender: 'Henk',
          lastViewed: '12-12-2019 09:00',
          relatedBooking: {
            from: 'Ergens',
            to: 'Ergens anders',
          },
          messages: [
            { content: 'Hallo', sender: 'Henk', timeStamp: '12-12-2019 09:00' },
            { content: 'Hoi', sender: 'You', timeStamp: '12-12-2019 09:10' },
          ],
        },
        {
          id: 2,
          sender: 'Netmobiel',
          lastViewed: '12-12-2019 10:00',
          messages: [
            {
              content:
                'Gepland onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden.',
              sender: 'Netmobiel',
              timeStamp: '12-12-2019 11:00',
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
