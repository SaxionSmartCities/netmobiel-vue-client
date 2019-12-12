<template>
  <v-container>
    <v-row>
      <h1>Berichten</h1>
    </v-row>
    <v-row>
      <v-list width="100%">
        <v-list-item-group>
          <template v-for="conversation in conversations">
            <conversation-list-item
              :key="conversation.id"
              :conversation="conversation"
            ></conversation-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-row>
    <v-row>
      EndOfLijstje
    </v-row>
  </v-container>
</template>

<script>
import ConversationListItem from '@/components/community/ConversationListItem.vue'
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
                'Gepland onderhoud. Vanwege smurfen in het systeem moet er een nieuwe firewall uitgerold worden. En toen gingen ze koffie drinken en leefden ze nog lang en gelukkig.',
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
