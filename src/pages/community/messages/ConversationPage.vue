<template>
  <content-pane :clearpadding="true">
    <template v-slot:header>
      <v-container class="py-1">
        <v-row dense>
          <v-col>
            {{ conversation.topic }}
          </v-col>
        </v-row>
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
      <v-col v-else>
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <span class="caption ml-2">Bericht ophalen...</span>
      </v-col>
    </v-row>
    <template v-if="recipientManagedIdentity" v-slot:footer>
      <v-row dense class="px-4 pb-1">
        <v-col class="pl-0">
          <v-text-field
            v-model.trim="newMessage"
            clearable
            outlined
            hide-details
            dense
            :label="'Bericht voor ' + recipientName"
          ></v-text-field>
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
import { beforeRouteEnter, beforeRouteLeave } from '@/utils/navigation'

export default {
  components: {
    ContentPane,
    MessageCard,
  },
  props: {
    conversationId: {
      type: String,
      required: false,
      default: '',
    },
    senderContext: {
      type: String,
      required: false,
      default: '',
    },
    recipientContext: {
      type: String,
      required: false,
      default: '',
    },
    recipientManagedIdentity: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      newMessage: '',
      isFetchingMessages: true,
      recipientProfile: undefined,
      theSenderContext: this.senderContext,
      theRecipientContext: this.recipientContext,
      theRecipientManagedIdentity: this.recipientManagedIdentity,
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
  },
  beforeRouteEnter: beforeRouteEnter({
    theSenderContext: value => value,
    theRecipientContext: value => value,
    theRecipientManagedIdentity: value => value,
  }),
  beforeRouteLeave: beforeRouteLeave({
    theSenderContext: value => value,
    theRecipientContext: value => value,
    theRecipientManagedIdentity: value => value,
  }),
  mounted() {
    msStore.mutations.setConversation({})
    msStore.mutations.setMessages([])
    this.isFetchingMessages = true
    if (this.conversationId) {
      msStore.actions.fetchConversation({ id: this.conversationId })
      msStore.actions
        .fetchMessages({ id: this.conversationId })
        .then(() => (this.isFetchingMessages = false))
    } else if (this.theSenderContext) {
      // Someone want to send a message
      msStore.actions
        .fetchConversationByContext({
          conversationContext: this.theSenderContext,
        })
        .then(c => this.fetchMessages(c))
        .then(() => (this.isFetchingMessages = false))
    } else {
      uiStore.actions.queueErrorNotification('Error looking up conversation')
      // Don't do this in the mount, it can lead to endless loop
      // this.$router.go(-1)
    }
    if (this.theRecipientManagedIdentity) {
      psStore.actions
        .fetchPublicProfile({ profileId: this.theRecipientManagedIdentity })
        .then(profile => {
          this.recipientProfile = profile
        })
        .catch()
    }
    // recipientContext: booking.bookingRef,
    // recipientManagedIdentity: booking.passenger.managedIdentity,
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  updated() {
    this.scrollToBottomMessageContainer()
  },
  methods: {
    // Lookup the messages for the conversation and return a promise.
    // Otherwise go back to the previous page
    // No, don't do that. In case of a reload there is no go back
    fetchMessages(conversation) {
      if (conversation) {
        return msStore.actions.fetchMessages({
          id: conversation.conversationRef,
        })
        // } else {
        //   // Go back to original page
        //   return this.$router.go(-1)
      }
    },
    isMessageSendByMe(msg) {
      return msg.sender?.managedIdentity === this.profile.id
    },
    scrollToBottomMessageContainer(animation = false) {
      let items = document.getElementById('message-container')
      if (items && items.children) {
        items = items.children
        if (items.length > 1) {
          var last = items[items.length - 1]
          animation
            ? last.scrollIntoView({ behavior: 'smooth', block: 'center' })
            : last.scrollIntoView()
        }
      }
    },
    myEnvelope(msg) {
      return msg.envelopes.find(
        env => env.recipient.managedIdentity === this.profile.id
      )
    },
    getMyContext(msg) {
      if (this.isMessageSendByMe(msg)) {
        return msg.context
      } else {
        return this.myEnvelope(msg)?.context
      }
    },
    onMessageClick(msg) {
      const ctx = this.getMyContext(msg)
      let pageName
      if (ctx.includes('booking')) {
        const rideId = this.conversation.contexts.find(c => c.includes('ride'))
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
            this.conversation.contexts.find(c => c.includes('ride')) || 'none'
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
      } else {
        // eslint-disable-next-line
        console.warn(`No support for ${ctx}`)
      }
    },
    sendMessage() {
      console.log('Send message')
      msStore.actions
        .sendMessage({
          body: this.newMessage,
          context: this.senderContext,
          deliveryMode: 'ALL',
          envelopes: [
            {
              context: this.recipientContext,
              recipient: { managedIdentity: this.recipientManagedIdentity },
            },
          ],
        })
        .then(() => {
          console.log('Fetch messages')
          this.newMessage = null
          return msStore.actions.fetchMessages({ id: this.conversationId })
        })
        .then(() => {
          console.log('Scroll bottom')
          this.$nextTick(() => {
            this.scrollToBottomMessageContainer(true)
          })
        })
        .catch(function(error) {
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

<style lang="scss">
.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
