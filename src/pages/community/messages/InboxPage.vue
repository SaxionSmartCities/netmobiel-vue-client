<template>
  <content-pane :clearpadding="true">
    <template v-slot:header>
      <tab-bar
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template v-slot:firstTab>
          <span>Recent</span>
        </template>

        <template v-slot:secondTab>
          <span>Archief</span>
        </template>
      </tab-bar>
    </template>
    <v-list three-line avatar class="pt-0 conversation-list">
      <template v-for="conversation in conversations">
        <v-divider :key="conversation.context + '-divider'" />
        <v-list-item
          :key="conversation.context"
          class=""
          @click="showConversation(conversation)"
        >
          <v-list-item-avatar size="60">
            <external-user-image
              :managed-identity="getIdentityViaConversation(conversation)"
              :image-size="55"
              :avatar-size="60"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <v-row dense>
                <v-col class="font-weight-medium">
                  {{
                    getReceiverViaConversationParticipants(
                      conversation.participants
                    )
                  }}
                </v-col>
                <!-- Let's hide the number of unread message for now until we have fixed it.
                <v-col class="px-2" cols="2">
                  <div class="message-counter">
                    {{ getNewMessageCount(conversation) }}
                  </div>
                </v-col> -->
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>
              <em>
                Laatst gewijzigd: {{ getConversationTimestamp(conversation) }}
              </em>
              <br />
              Van
              {{ getFromLabelFromContext(conversation.context) }}
              naar
              {{ getToLabelFromContext(conversation.context) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ExternalUserImage from '@/components/profile/ExternalUserImage'
import TabBar from '../../../components/common/TabBar'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as msStore from '@/store/message-service'
import moment from 'moment'
import { upperCaseFirst } from '@/utils/Utils.js'

export default {
  components: {
    TabBar,
    ContentPane,
    ExternalUserImage,
  },
  data() {
    return {
      selectedTab: 0,
    }
  },
  computed: {
    conversations() {
      return msStore.getters.getConversations
    },
    myId() {
      return psStore.getters.getProfile.id
    },
  },
  watch: {
    conversations(newValue) {
      const conversations = msStore.getters.getConversations
      csStore.actions.fetchRidesFromConversations(conversations)
    },
  },
  created: function() {
    uiStore.mutations.showBackButton()
    msStore.actions.fetchConversations()
  },
  methods: {
    getReceiverViaConversationParticipants(participants) {
      const res = participants.filter(
        user => user.managedIdentity !== this.myId
      )[0]
      if (res) {
        return res.givenName + ' ' + res.familyName
      }
      return 'not found'
    },
    getIdentityViaConversation(conversation) {
      const res = conversation.participants.filter(
        user => user.managedIdentity !== this.myId
      )[0]
      if (res) {
        return res.managedIdentity
      }
      return conversation.sender.managedIdentity
    },
    getRideFromContext(context) {
      const rides = csStore.getters.getInboxRides
      return rides.find(r => r.rideRef === context)
    },
    getFromLabelFromContext(context) {
      return this.getRideFromContext(context)?.fromPlace?.label || 'Onbekend'
    },
    getToLabelFromContext(context) {
      return this.getRideFromContext(context)?.toPlace?.label || 'Onbekend'
    },
    showConversation(conversation) {
      this.$router.push({
        name: `conversation`,
        params: {
          context: conversation.context,
          participants: conversation.participants.map(p => p.managedIdentity),
        },
      })
    },
    getNewMessageCount(conversation) {
      //TODO: Get the count from somewhere.
      return 0
    },
    getConversationTimestamp(conversation) {
      return upperCaseFirst(
        moment(conversation.creationTime)
          .locale('nl')
          .calendar()
      )
    },
  },
}
</script>

<style lang="scss">
.conversation-list {
  width: 100%;
}

.message-counter {
  border-radius: 1000px;
  background: $color-green;
  color: white;
  padding: 2px;
  text-align: center;
}
</style>
