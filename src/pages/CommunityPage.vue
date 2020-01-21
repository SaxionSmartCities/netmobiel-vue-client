<template>
  <content-pane :clearpadding="true">
    <template v-slot:header>
      <v-tabs
        id="tabs"
        v-model="selectedTab"
        grow
        centered
        slider-color="#bddade"
      >
        <v-tab class="white--text no-caps saved">
          <span>Recent</span>
        </v-tab>
        <v-tab class="white--text no-caps saved">
          <span>Archief</span>
        </v-tab>
      </v-tabs>
    </template>
    <v-list three-line avatar class="pt-0">
      <template v-for="conversation in conversations">
        <v-divider :key="conversation.id + '-divider'" />
        <v-list-item
          :key="conversation.id"
          class="px-0"
          @click="showConversation(conversation)"
        >
          <v-list-item-avatar size="60">
            <v-img :src="getUserData().image" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <v-row dense>
                <v-col>
                  {{ conversation.sender }}
                </v-col>
                <v-col class="px-2" cols="2">
                  <div class="message-counter">4</div>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>{{
              conversation.messages[0].content
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'

import moment from 'moment'

export default {
  components: {
    ContentPane,
  },
  data() {
    return {
      selectedTab: 0,
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
        {
          id: 3,
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
        {
          id: 4,
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
        {
          id: 5,
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
        {
          id: 6,
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
        {
          id: 7,
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
        {
          id: 8,
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
        {
          id: 9,
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
      this.$router.push({
        path: `/conversation/${conversation.id}`,
      })
    },
    getUserData() {
      return this.$store.getters['ps/getUser']
    },
  },
}
</script>

<style lang="scss">
.message-counter {
  border-radius: 1000px;
  background: $color-green;
  color: white;
  padding: 2px;
  text-align: center;
}
</style>
