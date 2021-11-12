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
    <template v-slot:footer>
      <v-row dense class="px-4 pb-1">
        <v-col class="pl-0">
          <v-text-field
            v-model.trim="newMessage"
            clearable
            outlined
            hide-details
            dense
            label="Typ een bericht"
            @focus="onInputMessageFocus"
            @focusout="onInputMessageFocusOut"
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

export default {
  components: {
    ContentPane,
    MessageCard,
  },
  props: {
    conversationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      newMessage: '',
      isFetchingMessages: true,
      recipientProfile: undefined,
    }
  },
  computed: {
    conversation() {
      return msStore.getters.getConversation
    },
    messages() {
      const msgs = msStore.getters.getMessages
      // console.log(`Got ${msgs.length} messages`)
      return msgs
    },
    profile() {
      return psStore.getters.getProfile
    },
  },
  mounted() {
    msStore.mutations.setConversation({})
    msStore.mutations.setMessages([])
    msStore.actions.fetchConversation({ id: this.conversationId })
    this.isFetchingMessages = true
    msStore.actions
      .fetchMessages({ id: this.conversationId })
      .then(() => (this.isFetchingMessages = false))
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  updated() {
    this.scrollToBottomMessageContainer()
  },
  methods: {
    onInputMessageFocus() {
      uiStore.mutations.disableFooter()
    },
    onInputMessageFocusOut() {
      uiStore.mutations.enableFooter()
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
          console.log(`Don't know how to handle ${ctx}`)
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
      const { firstName, lastName } = this.profile
      const envelopes = this.recipients.map(rcp =>
        Object.assign({}, { recipient: { managedIdentity: rcp } })
      )
      msStore.actions
        .sendMessage({
          body: this.newMessage,
          context: this.context,
          deliveryMode: 'ALL',
          envelopes: envelopes,
          managedIdentity: this.profile.id,
          subject: `Persoonlijk bericht van ${firstName} ${lastName}`,
        })
        .then(() => {
          this.newMessage = null
          this.$nextTick(() => {
            this.scrollToBottomMessageContainer(true)
          })
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
