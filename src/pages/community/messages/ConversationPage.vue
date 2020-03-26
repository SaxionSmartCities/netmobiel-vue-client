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
      <v-col id="message-container">
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
    }
  },
  computed: {
    sortedMessages() {
      let messages = Object.assign(
        [],
        this.$store.getters['ms/getActiveMessages']
      )
      return messages.sort(function(a, b) {
        a = new Date(a.creationTime)
        b = new Date(b.creationTime)
        return a < b ? -1 : a < b ? 1 : 0
      })
    },
    recipient() {
      const myId = this.$store.getters['ps/getProfile'].id
      return this.participants.find(
        recipient => recipient.managedIdentity !== myId
      )
    },
    profile() {
      return this.$store.getters['ps/getUser']
    },
    sender() {
      return this.$store.getters['ms/getConversationByContext'](this.context)
        .sender
    },
  },
  mounted() {
    this.$store.commit('ui/showBackButton')
  },
  updated() {
    this.scrollToBottomMessageContainer()
  },
  async created() {
    //This.context is the urn as path parameter in URL.
    //In this URN the : needs to be replaced cause javascript wont like it being used as a key
    await this.$store.dispatch('ms/fetchMessagesByParams', {
      context: this.context,
      participant: this.recipient.managedIdentity,
    })
    this.urn = (' ' + this.context.replace(/:/gi, '')).slice(1)
  },
  methods: {
    onInputMessageFocus() {
      this.$store.commit('ui/disableFooter')
    },
    onInputMessageFocusOut() {
      this.$store.commit('ui/enableFooter')
    },
    isMessageSendByMe(id) {
      return id === this.$store.getters['ps/getProfile'].id
    },
    scrollToBottomMessageContainer(animation = false) {
      var items = document.getElementById('message-container').children
      if (items && items.length > 1) {
        var last = items[items.length - 1]
        animation
          ? last.scrollIntoView({ behavior: 'smooth', block: 'center' })
          : last.scrollIntoView()
      }
    },
    sendMessage() {
      const envelopes = [{ recipient: this.recipient }]
      this.$store
        .dispatch('ms/sendMessage', {
          body: this.newMessage,
          context: this.context,
          deliveryMode: 'MESSAGE',
          envelopes: envelopes,
          managedIdentity: this.$store.getters['ps/getProfile'].id,
          subject: 'Van A naar B',
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
