<template>
  <content-pane>
    <template #header>
      <v-container class="py-1">
        <span class="text-subtitle-2">{{ conversation.topic }}</span>
        <v-divider class="mt-1" />
      </v-container>
    </template>
    <v-row dense>
      <v-col v-if="!isFetchingMessages" id="message-container">
        <template v-for="(message, index) in messages">
          <v-row :key="index">
            <v-col class="py-1">
              <message-card
                :send-by-me="isMessageSendByMe(message)"
                :message="message"
                @click="onMessageClick(message)"
              />
            </v-col>
          </v-row>
        </template>
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
        <v-col cols="1" align-self="center">
          <v-icon
            class="send-icon"
            :disabled="!newMessage"
            @click="sendMessage"
          >
            send
          </v-icon>
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
      isFetchingMessages: true,
      recipientProfile: undefined,
      savedConversationId: undefined,
      savedChatMeta: undefined,
      recipientManagedIdentity: undefined,
    }
  },
  computed: {
    conversation() {
      return msStore.getters.getConversation
    },
    messages() {
      return msStore.getters.getMessages
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
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    savedConversationId(newValue, oldValue) {
      // console.log(`savedConversationId: ${oldValue} --> ${newValue}`)
      if (newValue) {
        msStore.actions.fetchConversation({ id: newValue })
        msStore.actions
          .fetchMessages({ id: newValue })
          .then(() => (this.isFetchingMessages = false))
      }
    },
    // eslint-disable-next-line no-unused-vars
    savedChatMeta(newValue, oldValue) {
      // console.log(
      //   `savedChatMeta: ${oldValue} --> Sender ${newValue?.senderContext} Recipient ${newValue?.recipientContext} ${newValue?.recipientManagedIdentity}`
      // )
      this.recipientManagedIdentity = newValue.recipientManagedIdentity
      if (!this.savedConversationId) {
        msStore.actions
          .fetchConversationByContext({
            conversationContext: newValue.senderContext,
          })
          .then((c) => {
            if (c?.conversationRef) {
              this.savedConversationId = c.conversationRef
            } else {
              // eslint-disable-next-line
              console.error(
                `No Conversation found for urn ${newValue.senderContext}`
              )
            }
          })
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
  },
  created() {
    uiStore.mutations.showBackButton()
    if (this.conversationId) {
      this.savedConversationId = this.conversationId
      // console.log(`set savedConversationId = ${this.savedConversationId}`)
    }
    if (this.chatMeta) {
      this.savedChatMeta = this.chatMeta
      // console.log(
      //   `set savedChatMeta = Sender ${this.chatMeta?.senderContext} Recipient ${this.chatMeta?.recipientContext} ${this.chatMeta?.recipientManagedIdentity}`
      // )
    }
  },
  mounted() {
    msStore.mutations.setConversation({})
    msStore.mutations.setMessages([])
    this.isFetchingMessages = true
  },
  updated() {
    this.scrollToBottomMessageContainer()
  },
  methods: {
    isMessageSendByMe(msg) {
      return msg.sender?.managedIdentity === this.profile.id
    },
    scrollToBottomMessageContainer(animation = false) {
      let items = document.getElementById('message-container')
      if (items && items.children) {
        items = items.children
        if (items.length > 1) {
          const last = items[items.length - 1]
          animation
            ? last.scrollIntoView({ behavior: 'smooth', block: 'center' })
            : last.scrollIntoView()
        }
      }
    },
    myEnvelope(msg) {
      return msg.envelopes.find(
        (env) => env.recipient.managedIdentity === this.profile.id
      )
    },
    getMyContext(msg) {
      if (this.isMessageSendByMe(msg)) {
        return msg.context
      } else {
        return this.myEnvelope(msg)?.context
      }
    },
    // Redirect the user to the relevant page if the system is the sender
    // Otherwise enable the chat box to reply to the sender
    onMessageClick(msg) {
      if (msg.sender) {
        // A real person has sent a message. That could be me or someone else.
        if (this.isMessageSendByMe(msg)) {
          // I was me and I want to send  a message again
          const rcpEnvelope = msg.envelopes[0]
          this.savedChatMeta = {
            senderContext: msg.context,
            recipientContext: rcpEnvelope.context,
            recipientManagedIdentity: rcpEnvelope.recipient.managedIdentity,
          }
        } else {
          // The message was sent by someone else.
          // The chat message metadata are simply the opposite of the received message
          this.savedChatMeta = {
            senderContext: this.myEnvelope(msg).context,
            recipientContext: msg.context,
            recipientManagedIdentity: msg.sender.managedIdentity,
          }
          this.recipientManagedIdentity =
            this.savedChatMeta.recipientManagedIdentity
        }
      } else {
        const ctx = this.getMyContext(msg)
        if (ctx.includes('booking')) {
          const rideId = this.conversation.contexts.find((c) =>
            c.includes('ride')
          )
          if (rideId) {
            this.$router.push({
              name: 'rideDetailPage',
              params: { rideId: rideId },
            })
          } else {
            // eslint-disable-next-line
            console.error(`Expected a ride in the conversation with ${ctx}`)
          }
        } else if (ctx.includes('ride')) {
          this.$router.push({
            name: 'rideDetailPage',
            params: { rideId: ctx },
          })
        } else if (ctx.includes('tripplan')) {
          // Right. Is it the passenger or the driver looking at it
          if (
            this.conversation.ownerRole ===
            constants.CONVERSATION_OWNER_ROLE.DRIVER
          ) {
            const rideId =
              this.conversation.contexts.find((c) => c.includes('ride')) ||
              'none'
            this.$router.push({
              name: 'shoutOutDriver',
              params: { shoutOutId: ctx, rideId: rideId },
            })
          } else {
            this.$router.push({
              name: 'shoutOutPassenger',
              params: { shoutOutId: ctx },
            })
          }
        } else if (ctx.includes('trip')) {
          this.$router.push({
            name: 'tripDetailPage',
            params: { tripId: ctx },
          })
        } else if (ctx.includes('reward')) {
          this.$router.push({
            name: 'rewardOverviewPage',
          })
        } else {
          // eslint-disable-next-line
          console.warn(`No support for ${ctx}`)
        }
      }
    },
    sendMessage() {
      // console.log('Send message')
      msStore.actions
        .sendMessage({
          body: this.newMessage,
          context: this.savedChatMeta.senderContext,
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
          this.newMessage = null
          return msStore.actions.fetchMessages({ id: this.savedConversationId })
        })
        .then(() => {
          this.$nextTick(() => {
            this.scrollToBottomMessageContainer(true)
          })
        })
        .catch(function (error) {
          // eslint-disable-next-line
          console.log(error)
          uiStore.actions.queueErrorNotification(
            'Versturen van bericht is niet gelukt.'
          )
        })
    },
  },
}
</script>
