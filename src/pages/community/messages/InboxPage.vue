<template>
  <content-pane>
    <template #header>
      <tab-bar
        class="shrink"
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template #firstTab>
          <span>Recent</span>
        </template>

        <template #secondTab>
          <span>Archief</span>
        </template>
      </tab-bar>
    </template>
    <v-list three-line avatar class="pt-0 conversation-list">
      <template v-for="(cvs, index) in conversations">
        <v-divider v-show="index !== 0" :key="cvs.id + '-divider'" />
        <v-list-item :key="cvs.id" class="pa-0" @click="showConversation(cvs)">
          <v-list-item-avatar size="60">
            <external-user-image
              :managed-identity="user(cvs.recentMessage).managedIdentity"
              :image-size="54"
              :avatar-size="60"
            />
          </v-list-item-avatar>
          <v-list-item-content class="pa-0 ma-0">
            <v-list-item-title class="pa-0 ma-0">
              <v-row dense class="justify-space-between flex-nowrap pa-0">
                <v-col class="text-subtitle-2 font-weight-bold">
                  {{ name(user(cvs.recentMessage)) }}
                </v-col>
                <!-- Let's hide the number of unread message for now until we have fixed it.
                <v-col class="px-2" cols="2">
                  <div class="message-counter">
                    {{ getNewMessageCount(conversation) }}
                  </div>
                </v-col> -->
                <!--                <v-col class="px-1 py-1 text-right" cols="5">-->
                <!--                  <em>{{ timestamp(cvs.recentMessage.createdTime) }}</em>-->
                <!--                </v-col>-->
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-2">
              <!--              <div class="px-1 py-1 text-right">-->
              <!--                <em>{{ getTimestamp(cvs.recentMessage.createdTime) }}</em>-->
              <!--              </div>-->
              <div>
                {{ cvs.topic }}
              </div>
            </v-list-item-subtitle>
            <v-list-item-subtitle
              class="font-italic text-caption text-right mt-n1"
            >
              <em>{{ timestamp(cvs.recentMessage.createdTime) }}</em>
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
    profile() {
      return psStore.getters.getProfile
    },
    conversations() {
      return this.isActualTab
        ? msStore.getters.getActualConversations
        : msStore.getters.getArchivedConversations
    },
    isActualTab() {
      return this.selectedTab === 0
    },
    isArchiveTab() {
      return this.selectedTab === 1
    },
  },
  created: function () {
    uiStore.mutations.showBackButton()
    msStore.actions.fetchActualConversations()
    msStore.actions.fetchArchivedConversations()
  },
  methods: {
    isMessageSendByMe(msg) {
      return msg.sender?.managedIdentity === this.profile.id
    },
    recipient(msg) {
      // Only the first
      return msg.envelopes[0].recipient
    },
    sender(msg) {
      return msg.sender
        ? msg.sender
        : {
            managedIdentity: constants.SYSTEM_IDENTITY,
            givenName: '',
            familyName: constants.SYSTEM_NAME,
          }
    },
    name(user) {
      return `${user.givenName} ${user.familyName}`.trim()
    },
    user(msg) {
      return this.isMessageSendByMe(msg)
        ? this.recipient(msg)
        : this.sender(msg)
    },
    showConversation(conversation) {
      this.$router.push({
        name: 'conversation',
        params: {
          conversationId: conversation.conversationRef,
        },
      })
    },
    // eslint-disable-next-line no-unused-vars
    getNewMessageCount(conversation) {
      //TODO: Get the count from somewhere.
      return 0
    },
    timestamp(timestamp) {
      return upperCaseFirst(moment(timestamp).locale('nl').calendar())
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
