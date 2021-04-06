<template>
  <content-pane :clearpadding="true">
    <template v-slot:header>
      <v-container class="py-1">
        <v-row dense>
          <v-col class="shrink">
            <v-img class="profile-image" :src="profile.image" />
          </v-col>
          <v-col align-self="center" class="d-flex px-3">
            <h4>
              {{ recipient.givenName + ' ' + recipient.familyName }}
            </h4>
            <v-spacer></v-spacer>
            <v-btn color="primary" small rounded outlined>
              <i class="fas fa-comments"></i>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mt-1" />
      </v-container>
    </template>
    <v-row dense>
      <v-col v-if="!isFetchingMessages" id="message-container">
        <template v-for="(message, index) in sortedMessages">
          <v-row :key="index">
            <v-col class="py-1">
              <message-card
                :send-by-me="isMessageSendByMe(message.sender.managedIdentity)"
                :message="message"
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

export default {
  components: {
    ContentPane,
    MessageCard,
  },
  props: {
    context: {
      type: String,
      required: true,
    },
    participants: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      urn: '',
      newMessage: '',
      isFetchingMessages: true,
    }
  },
  computed: {
    sortedMessages() {
      let messages = Object.assign([], msStore.getters.getActiveMessages)
      return messages.sort(function(a, b) {
        a = new Date(a.creationTime)
        b = new Date(b.creationTime)
        return a < b ? -1 : a < b ? 1 : 0
      })
    },
    recipient() {
      const myId = this.profile.id
      return this.participants.find(
        recipient => recipient.managedIdentity !== myId
      )
    },
    profile() {
      return psStore.getters.getProfile
    },
    sender() {
      return msStore.getters.getConversationByContext(this.context).sender
    },
  },
  mounted() {
    uiStore.mutations.showBackButton()
  },
  updated() {
    this.scrollToBottomMessageContainer()
  },
  created() {
    //This.context is the urn as path parameter in URL.
    //In this URN the ':' needs to be replaced cause javascript wont like it being used as a key
    msStore.actions
      .fetchMessagesByParams({
        context: this.context,
        participant: this.recipient.managedIdentity,
      })
      .then(() => {
        this.isFetchingMessages = false
      })
    this.urn = (' ' + this.context.replace(/:/gi, '')).slice(1)
  },
  methods: {
    onInputMessageFocus() {
      uiStore.mutations.disableFooter()
    },
    onInputMessageFocusOut() {
      uiStore.mutations.enableFooter()
    },
    isMessageSendByMe(id) {
      return id === this.profile.id
    },
    scrollToBottomMessageContainer(animation = false) {
      var items = document.getElementById('message-container')
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
    sendMessage() {
      const { firstName, lastName } = this.profile
      const { familyName, givenName, managedIdentity } = this.recipient
      const envelopes = [
        { recipient: { familyName, givenName, managedIdentity } },
      ]
      msStore.actions
        .sendMessage({
          body: this.newMessage,
          context: this.context,
          deliveryMode: 'ALL',
          envelopes: envelopes,
          managedIdentity: this.profile.id,
          subject: `Nieuw bericht van ${firstName} ${lastName}`,
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
