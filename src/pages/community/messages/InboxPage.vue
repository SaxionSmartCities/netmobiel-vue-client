<template>
  <content-pane scrollable @low="onLowWater">
    <template #header>
      <tab-bar
        class="shrink"
        :selected-tab-model="selectedTab"
        @tabChange="(n) => (selectedTab = n)"
      >
        <template #firstTab>
          <span>Actueel</span>
        </template>

        <template #secondTab>
          <span>Archief</span>
        </template>
      </tab-bar>
    </template>
    <p
      v-if="conversations.totalCount === 0"
      class="text-center pt-4 text-body-1"
    >
      <span v-if="isActualTab"> Geen actuele berichten beschikbaar </span>
      <span v-else> Geen gearchiveerde berichten beschikbaar </span>
    </p>
    <v-list v-else three-line avatar class="pt-0 conversation-list">
      <template v-for="(cvs, index) in conversations.data">
        <v-divider v-show="index !== 0" :key="cvs.id + '-divider'" />
        <v-badge
          :key="cvs.id"
          color="red"
          offset-x="2em"
          offset-y="4ex"
          style="width: inherit"
          :value="cvs.unreadCount > 0"
          :content="cvs.unreadCount"
        >
          <v-list-item class="pa-0" @click="showConversation(cvs)">
            <v-list-item-avatar size="60">
              <external-user-image
                :managed-identity="user(cvs.recentMessage).managedIdentity"
                :image-size="54"
                :avatar-size="60"
              />
            </v-list-item-avatar>
            <v-list-item-content class="pa-0 ma-0">
              <v-list-item-title
                class="pa-0 ma-0 text-subtitle-2 font-weight-bold"
              >
                {{ name(user(cvs.recentMessage)) }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-body-2">
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
        </v-badge>
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
import {
  restoreDataBeforeRouteEnter,
  saveDataBeforeRouteLeave,
} from '@/utils/navigation'

export default {
  components: {
    TabBar,
    ContentPane,
    ExternalUserImage,
  },
  beforeRouteEnter(to, from, next) {
    // The restore is called after the mount!
    // console.log(`beforeRouteEnter: ${from.name} --> ${to.name}`)
    next((vm) =>
      restoreDataBeforeRouteEnter(vm, {
        selectedTab: (value) => value,
      })
    )
  },
  beforeRouteLeave(to, from, next) {
    // console.log(`beforeRouteLeave: ${from.name} --> ${to.name}`)
    saveDataBeforeRouteLeave(this, {
      selectedTab: (value) => value,
    })
    next()
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
    actualConversations() {
      return msStore.getters.getActualConversations
    },
    archivedConversations() {
      return msStore.getters.getArchivedConversations
    },
    conversations() {
      return this.isActualTab
        ? this.actualConversations
        : this.archivedConversations
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
    this.fetchActualConversations()
    this.fetchArchivedConversations()
  },
  methods: {
    fetchActualConversations(offset = 0) {
      if (offset === 0 || offset < this.actualConversations.totalCount) {
        msStore.actions.fetchActualConversations({
          offset,
          maxResults: constants.fetchConversationsMaxResults,
        })
      }
    },
    fetchArchivedConversations(offset = 0) {
      if (offset === 0 || offset < this.archivedConversations.totalCount) {
        msStore.actions.fetchArchivedConversations({
          offset,
          maxResults: constants.fetchConversationsMaxResults,
        })
      }
    },
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
    timestamp(timestamp) {
      return upperCaseFirst(moment(timestamp).locale('nl').calendar())
    },
    onLowWater() {
      if (this.isActualTab) {
        this.fetchActualConversations(this.actualConversations.data.length)
      } else {
        this.fetchArchivedConversations(this.archivedConversations.data.length)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.conversation-list {
  width: 100%;
}

.message-counter {
  display: inline-block;
  width: 2em;
  border-radius: 50%;
  background-color: $color-alertRed;
  color: white;
  padding: 2px;
  text-align: center;
}
</style>
