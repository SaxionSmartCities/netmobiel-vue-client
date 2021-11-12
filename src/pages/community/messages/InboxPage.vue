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
      <template v-for="cvs in conversations">
        <v-divider :key="cvs.id + '-divider'" />
        <v-list-item :key="cvs.id" class="" @click="showConversation(cvs)">
          <v-list-item-avatar size="60">
            <external-user-image
              :managed-identity="
                getParticipantIdentity(cvs.recentMessage.sender)
              "
              :image-size="55"
              :avatar-size="60"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <v-row dense class="justify-space-between flex-nowrap">
                <v-col class="font-weight-medium">
                  {{ getParticipantName(cvs.recentMessage.sender) }}
                </v-col>
                <!-- Let's hide the number of unread message for now until we have fixed it.
                <v-col class="px-2" cols="2">
                  <div class="message-counter">
                    {{ getNewMessageCount(conversation) }}
                  </div>
                </v-col> -->
                <v-col class="px-1 py-1 text-right" cols="5">
                  <em>{{ getTimestamp(cvs.recentMessage.createdTime) }}</em>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>
              <!--              <div class="px-1 py-1 text-right">-->
              <!--                <em>{{ getTimestamp(cvs.recentMessage.createdTime) }}</em>-->
              <!--              </div>-->
              <div>
                {{ cvs.topic }}
              </div>
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
import constants from '@/constants/constants'

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
      return this.isActualTab
        ? msStore.getters.getActualConversations
        : msStore.getters.getArchivedConversations
    },
    myId() {
      return psStore.getters.getProfile.id
    },
    isActualTab() {
      return this.selectedTab === 0
    },
    isArchiveTab() {
      return this.selectedTab === 1
    },
  },
  created: function() {
    uiStore.mutations.showBackButton()
    msStore.actions.fetchActualConversations()
    msStore.actions.fetchArchivedConversations()
  },
  methods: {
    getParticipantIdentity(ptcp) {
      return ptcp ? ptcp.managedIdentity : constants.SYSTEM_IDENTITY
    },
    getParticipantName(ptcp) {
      return ptcp
        ? ptcp.givenName + ' ' + ptcp.familyName
        : constants.SYSTEM_NAME
    },
    showConversation(conversation) {
      this.$router.push({
        name: 'conversation',
        params: {
          conversationId: conversation.conversationRef,
        },
      })
    },
    getNewMessageCount(conversation) {
      //TODO: Get the count from somewhere.
      return 0
    },
    getTimestamp(timestamp) {
      return upperCaseFirst(
        moment(timestamp)
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
