<template>
  <content-pane
    scrollable
    direction="top"
    :low-water="150"
    :content-stamp="contentUpdated"
    @low="onLowWater"
  >
    <template #header>
      <v-container class="py-1">
        <span class="text-subtitle-2">{{
          conversation && conversation.topic
        }}</span>
        <v-divider class="mt-1" />
      </v-container>
    </template>
    <v-row dense>
      <v-col v-if="!isFetchingMessages" ref="messageContainer">
        <v-row v-for="(message, index) in messageList" :key="message.id">
          <v-col class="py-1">
            <div
              v-if="index === firstUnreadMessageIndex"
              class="my-2 pa-1 unreadMessageBox text-center caption font-weight-bold"
            >
              <span class="pa-1">Ongelezen berichten</span>
            </div>
            <message-card :message="message" @click="onMessageClick(message)" />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else class="my-2">
        <v-progress-circular indeterminate color="button"></v-progress-circular>
        <span class="ml-2">Berichten ophalen...</span>
      </v-col>
    </v-row>
    <template v-if="showChatBox" #footer>
      <v-row dense class="px-4 pb-1 align-content-end">
        <v-col class="pl-0">
          <v-textarea
            v-model.trim="newMessage"
            outlined
            hide-details
            dense
            auto-grow
            rows="2"
            :label="'Bericht voor ' + recipientName"
          ></v-textarea>
        </v-col>
        <v-col cols="1" align-self="center" class="mr-2">
          <v-btn
            icon
            outlined
            color="button"
            :disabled="!newMessage"
            @click="sendMessage"
          >
            <v-icon> send </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import MessageCard from '@/components/community/MessageCard.vue'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as msStore from '@/store/message-service'
import constants from '@/constants/constants'
import {
  restoreDataBeforeRouteEnter,
  saveDataBeforeRouteLeave,
} from '@/utils/navigation'
import { emptyPage } from '@/store/storeHelper'
import { decodeUrn } from '@/utils/UrnHelper'
import { EventBus } from '@/utils/EventBus'

// Maximum number of messages in one fetch
const maxMessages = 100

export default {
  components: {
    ContentPane,
    MessageCard,
  },
  beforeRouteEnter(to, from, next) {
    // The restore is called after the mount!
    // console.log(`beforeRouteEnter: ${from.name} --> ${to.name}`)
    next((vm) =>
      restoreDataBeforeRouteEnter(vm, {
        savedConversationId: (value) => value,
        savedChatMeta: (value) => value,
      })
    )
  },
  beforeRouteLeave(to, from, next) {
    // console.log(`beforeRouteLeave: ${from.name} --> ${to.name}`)
    if (this.savedConversationId && this.$keycloak.authenticated) {
      msStore.actions.acknowledgeConversation(this.savedConversationId)
    }
    saveDataBeforeRouteLeave(this, {
      savedConversationId: (value) => value,
      savedChatMeta: (model) => model,
    })
    next()
  },
  props: {
    conversationId: {
      type: String,
      required: false,
      default: '',
    },
    chatMeta: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      newMessage: '',
      isFetchingMessages: false,
      recipientProfile: undefined,
      savedConversationId: undefined,
      savedChatMeta: undefined,
      recipientManagedIdentity: undefined,
      // Scroll to bottom after loading messages
      autoScrollToBottom: true,
      contentUpdated: '',
      messageContainerHeight: 0,
      initialUnreadMessageIndex: null,
    }
  },
  computed: {
    conversation() {
      return msStore.getters.getConversation
    },
    messages() {
      return msStore.getters.getMessages
    },
    messageList() {
      return [...this.messages.data].reverse()
    },
    profile() {
      return psStore.getters.getProfile
    },
    recipientName() {
      return `${this.recipientProfile?.firstName} ${this.recipientProfile?.lastName}`.trim()
    },
    showChatBox() {
      return (
        this.savedChatMeta?.recipientManagedIdentity && this.savedConversationId
      )
    },
    firstUnreadMessageIndex() {
      const unreadMsg = this.messageList.find(
        (msg) => !this.isMessageSendByMe(msg) && !this.myEnvelope(msg)?.ackTime
      )
      return unreadMsg ? this.messageList.indexOf(unreadMsg) : -1
    },
    firstAckMessageIndex() {
      const ackMsg = this.messageList.find(
        (msg) => !this.isMessageSendByMe(msg) && this.myEnvelope(msg)?.ackTime
      )
      return ackMsg ? this.messageList.indexOf(ackMsg) : -1
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    savedConversationId(newValue, oldValue) {
      // console.log(`savedConversationId: ${oldValue} --> ${newValue}`)
      if (newValue) {
        msStore.actions.fetchConversation({ id: newValue })
        this.fetchMessages()
      }
    },
    // eslint-disable-next-line no-unused-vars
    savedChatMeta(newValue, oldValue) {
      // console.log(
      //   `savedChatMeta: ${oldValue} --> Message ${newValue?.context} Sender ${newValue?.senderContext} Recipient ${newValue?.recipientContext} ${newValue?.recipientManagedIdentity}`
      // )
      this.recipientManagedIdentity = newValue.recipientManagedIdentity
      if (!this.savedConversationId) {
        this.updateSavedConversation(newValue.senderContext)
      }
    },
    // eslint-disable-next-line no-unused-vars
    recipientManagedIdentity(newValue, oldValue) {
      if (newValue) {
        psStore.actions
          .fetchPublicProfile({
            profileId: newValue,
          })
          .then((profile) => {
            this.recipientProfile = profile
          })
          .catch()
      }
    },
    messageList() {
      // The messageList contains messages ordered from older to newest.
      // The top of the messageList (the oldest message in the list) is not necessarily the
      // oldest in the database. To be sure, find in the current list the first message read and
      // the first unread. If there is unread but no read, then fetch more messages
      // Only scroll into view to unread item if initialUnreadMessageIndex is still undefined.
      // console.log(
      //   `List ${this.messageList.length} First unread: ${this.firstUnreadMessageIndex} First ack ${this.firstAckMessageIndex}`
      // )
      if (
        this.firstUnreadMessageIndex >= 0 &&
        this.initialUnreadMessageIndex == null
      ) {
        if (
          // If there is no ack-ed message before the unread one, there might be more.
          this.firstUnreadMessageIndex >= 0 &&
          this.firstAckMessageIndex === -1 &&
          this.messages.totalCount > this.messages.data.length
        ) {
          // Fetch more messages until we find the first acknowledged message
          this.fetchMessages(this.messages.data.length)
        } else {
          if (this.firstUnreadMessageIndex >= 0) {
            this.initialUnreadMessageIndex = this.firstUnreadMessageIndex
            // console.log(
            //   `initialUnreadMessageIndex = ${this.initialUnreadMessageIndex}`
            // )
          }
          this.$nextTick(() => {
            this.scrollMessageIntoView(false, this.initialUnreadMessageIndex)
          })
        }
      } else {
        if (this.autoScrollToBottom && this.messageList.length > 0) {
          // Only when the user has not started scrolling go to the bottom at once after update
          this.$nextTick(() => {
            this.scrollMessageIntoView(false)
            this.autoScrollToBottom = false
          })
        }
      }
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    if (this.conversationId) {
      this.savedConversationId = this.conversationId
      // console.log(`set savedConversationId = ${this.savedConversationId}`)
    }
    if (this.chatMeta) {
      this.savedChatMeta = { ...this.chatMeta }
      // console.log(
      //   `set savedChatMeta =  Message ${this.chatMeta?.context} Sender ${this.chatMeta?.senderContext} Recipient ${this.chatMeta?.recipientContext} ${this.chatMeta?.recipientManagedIdentity}`
      // )
    }
    msStore.mutations.setConversation(null)
    msStore.mutations.setMessages(emptyPage)
    EventBus.$on('message-received', this.onMessageReceived)
  },
  beforeDestroy() {
    EventBus.$off('message-received', this.onMessageReceived)
  },
  // updated() {
  //TODO Use either this method or the $nextTick in the messageList watcher. What is better?
  // Called after the component has updated its DOM tree due to a reactive state change.
  // if (this.autoScrollToBottom) {
  // Only when the user has not started scrolling go to the bottom at once after update
  // JR ???? this.scrollMessageIntoView()
  // }
  // console.log(`ConversationPage: Updated`)
  // if (this.$refs.messageContainer) {
  //   if (this.messages.data.length > 0) {
  //     if (
  //       this.messageContainerHeight !==
  //       this.$refs.messageContainer.scrollHeight
  //     ) {
  //       this.contentUpdated = `${moment().valueOf()}`
  //     }
  //   }
  //   this.messageContainerHeight = this.$refs.messageContainer.scrollHeight
  // }
  // },
  methods: {
    onMessageReceived(msg) {
      // console.log(`Message received: ${msg.msgId} ${msg.title} ${msg.body}`)
      this.fetchConversationIdFromMessage(msg.msgId).then((convId) => {
        if (convId === this.conversationId) {
          // Message received in current conversation. Reload messages and scroll to end
          const maxResults = Math.min(maxMessages, this.messages.data.length)
          return this.fetchMessages(0, maxResults).then(() => {
            this.$nextTick(() => {
              this.scrollMessageIntoView(false)
            })
          })
        } else {
          const textMessage = [msg.title || '', msg.body]
            .filter((elem) => elem)
            .join(': ')
          return uiStore.actions.queueInfoNotification(textMessage)
        }
      })
    },
    onLowWater() {
      // console.log(`ConversationPage: Low water!`)
      // The user has touched the scroll, switch-off automatic scroll
      this.autoScrollToBottom = false
      this.fetchMessages(this.messages.data.length)
    },
    fetchMessages(offset = 0, maxResults = constants.fetchMessagesMaxResults) {
      if (this.isFetchingMessages) {
        return Promise.resolve()
      }
      if (offset === 0 || offset < this.messages.totalCount) {
        this.isFetchingMessages = true
        return msStore.actions
          .fetchMessages({
            conversationId: this.savedConversationId,
            sortDir: 'DESC',
            offset,
            maxResults,
          })
          .then(() => {
            this.isFetchingMessages = false
          })
      }
      return Promise.resolve()
    },
    isMessageSendByMe(msg) {
      return msg.sender?.managedIdentity === this.profile.id
    },
    /**
     * Scroll the message into view. Not so trivial. See also the following link:
     * https://stackoverflow.com/questions/52086128/vue-js-ref-inside-the-v-for-loop
     * @param animation smooth or auto
     * @param itemIndex if set scroll the nth item into view. Otherwise end of list.
     */
    scrollMessageIntoView(animation, itemIndex) {
      const items = this.$refs.messageContainer?.children
      //console.log(`Scroll: itemIndex ${itemIndex}, #items ${items.length}`)
      if (items && items.length > 0) {
        const item = items[itemIndex ?? items.length - 1]
        item.scrollIntoView({
          behavior: animation ? 'smooth' : 'auto',
          block: itemIndex != null ? 'center' : 'end',
        })
      }
    },
    myEnvelope(msg) {
      return msg.envelopes.find(
        (env) => env.recipient.managedIdentity === this.profile.id
      )
    },
    getMyContext(msg) {
      if (this.isMessageSendByMe(msg)) {
        return msg.senderContext
      } else {
        return this.myEnvelope(msg)?.context
      }
    },
    updateSavedConversation(senderContext, create = true) {
      msStore.actions
        .fetchConversationByContext({
          conversationContext: senderContext,
        })
        .then((pr) => {
          if (!pr) {
            // Error message is already presented in actions
            return null
          }
          if (pr.data.length > 0) {
            this.savedConversationId = pr.data[0].conversationRef
          } else if (create) {
            // No conversation! Try to start one (do this only once)
            const c = {
              initialContext: senderContext,
            }
            msStore.actions.startConversation(c).then((location) => {
              if (location) {
                // Ok, try again, but don't create if not present
                this.updateSavedConversation(senderContext, false)
              }
            })
          }
        })
    },
    sendMessage() {
      // console.log('Send message')
      msStore.actions
        .sendMessage({
          body: this.newMessage,
          context: this.savedChatMeta.context,
          senderContext: this.savedChatMeta.senderContext,
          deliveryMode: 'ALL',
          envelopes: [
            {
              context: this.savedChatMeta.recipientContext,
              recipient: {
                managedIdentity: this.savedChatMeta.recipientManagedIdentity,
              },
            },
          ],
        })
        .then(() => {
          // Get a complete page, or get the current list plus one (to count for my message just sent)
          const maxResults = Math.min(
            maxMessages,
            Math.max(
              this.messages.data.length + 1,
              constants.fetchMessagesMaxResults
            )
          )
          this.newMessage = null
          return this.fetchMessages(0, maxResults)
        })
        .then(() => {
          this.$nextTick(() => {
            this.scrollMessageIntoView(false)
          })
        })
        .catch(() => {
          uiStore.actions.queueErrorNotification(
            'Versturen van bericht is niet gelukt.'
          )
        })
    },
    onChatMessageClicked(msg) {
      if (this.isMessageSendByMe(msg)) {
        // I was me and I want to send  a message again
        const rcpEnvelope = msg.envelopes[0]
        this.savedChatMeta = {
          context: msg.context,
          senderContext: msg.senderContext,
          recipientContext: rcpEnvelope.context,
          recipientManagedIdentity: rcpEnvelope.recipient.managedIdentity,
        }
      } else {
        // The message was sent by someone else.
        // The chat message metadata are simply the opposite of the received message
        this.savedChatMeta = {
          context: msg.context,
          senderContext: this.myEnvelope(msg).context,
          recipientContext: msg.senderContext,
          recipientManagedIdentity: msg.sender.managedIdentity,
        }
        this.recipientManagedIdentity =
          this.savedChatMeta.recipientManagedIdentity
      }
    },
    onSystemMessageClicked(msg) {
      let location
      const ctx = this.getMyContext(msg)
      const clazz = decodeUrn(ctx).class
      // const cvsDecoded = this.conversation.contexts.map((c) => decodeUrn(c))
      if (clazz === 'ride') {
        location = {
          name: 'rideDetailPage',
          params: { rideId: ctx },
        }
      } else if (clazz === 'tripplan') {
        // Right. Is it the passenger or the driver looking at it
        if (
          this.conversation.ownerRole ===
          constants.CONVERSATION_OWNER_ROLE.DRIVER
        ) {
          location = {
            name: 'shoutOutDriver',
            params: { shoutOutId: ctx },
          }
        } else {
          location = {
            name: 'shoutOutPassenger',
            params: { shoutOutId: ctx },
          }
        }
      } else if (clazz === 'trip') {
        location = {
          name: 'tripDetailPage',
          params: { tripId: ctx },
        }
      } else if (clazz === 'reward') {
        location = {
          name: 'rewardOverviewPage',
        }
      } else {
        // eslint-disable-next-line
        console.warn(`No support for ${ctx}`)
      }
      return location
    },
    // Redirect the user to the relevant page if the system is the sender
    // Otherwise enable the chat box to reply to the sender
    onMessageClick(msg) {
      if (msg.sender) {
        // A real person has sent a message. That could be me or someone else.
        this.onChatMessageClicked(msg)
      } else {
        // It was a system message, find the new location
        const location = this.onSystemMessageClicked(msg)
        if (location) {
          this.$router.push(location)
        }
      }
    },
    fetchConversationIdFromMessage(msgId) {
      return msStore.actions
        .fetchMessage({ id: msgId })
        .then((msg) => {
          // Now goto the relevant (i.e., my) conversation. Find whether
          // that should be the sender's conversation or the recipient
          let conversationId
          if (msg?.sender?.managedIdentity === this.profile.id) {
            conversationId = msg.senderConversationRef
          } else {
            conversationId = msg?.envelopes.find(
              (env) => env.recipient.managedIdentity === this.profile.id
            )?.conversationRef
          }
          return conversationId
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.unreadMessageBox {
  background-color: $color-light-grey;
}
.unreadMessageBox > span {
  border-radius: 6px;
  background-color: $color-white;
}
</style>
