<template>
  <content-pane :clearpadding="true">
    <template v-slot:header>
      <v-container class="py-1">
        <v-row dense>
          <v-col class="shrink">
            <v-img
              v-if="recipientProfile"
              class="profile-image"
              :src="recipientProfile.image"
            />
          </v-col>
          <v-col align-self="center" class="d-flex px-3">
            <h4 v-if="recipientProfile">
              {{ recipientProfile.firstName + ' ' + recipientProfile.lastName }}
            </h4>
            <v-spacer></v-spacer>
            <v-btn color="primary" small rounded outlined>
              <i class="fas fa-comments"></i>
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="contextText" dense>
          <p class="description">{{ contextText }}</p>
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
    contextText: {
      type: String,
      required: false,
      default: '',
    },
    participants: {
      type: Array,
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
    sortedMessages() {
      let messages = Object.assign([], msStore.getters.getActiveMessages)
      return messages.sort(function(msg1, msg2) {
        const a = msg1.creationTime
        const b = msg2.creationTime
        return a < b ? -1 : a > b ? 1 : 0
      })
    },
    recipients() {
      return this.participants.filter(p => p !== this.profile.id)
    },
    mainRecipient() {
      return this.recipients?.length > 0 ? this.recipients[0] : undefined
    },
    profile() {
      return psStore.getters.getProfile
    },
  },
  mounted() {
    uiStore.mutations.showBackButton()
  },
  created() {
    psStore.actions
      .fetchUserProfile({
        profileId: this.mainRecipient,
      })
      .then(profile => {
        this.recipientProfile = profile
      })
    msStore.actions
      .fetchMessagesByParams({
        context: this.context,
        participants: this.profile.id,
      })
      .then(() => {
        this.isFetchingMessages = false
      })
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
