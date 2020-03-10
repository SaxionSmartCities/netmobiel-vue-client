<template>
  <content-pane :clearpadding="true">
    <template v-slot:header>
      <v-container class="py-1">
        <v-row dense>
          <v-col class="shrink">
            <v-img class="profile-image" :src="profile.image" />
          </v-col>
          <v-col align-self="center" class="d-flex px-3">
            <h4>{{ sender.givenName + ' ' + sender.familyName }}</h4>
            <v-spacer></v-spacer>
            <v-btn color="primary" small rounded outlined>
              <v-icon>call</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mt-1" />
      </v-container>
    </template>
    <v-row dense>
      <v-col>
        <template v-for="message in conversation">
          <v-row :key="message.id">
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
            clearable
            outlined
            hide-details
            dense
            label="Typ een bericht"
          ></v-text-field>
        </v-col>
        <v-col cols="1" align-self="center">
          <v-icon class="send-icon">send</v-icon>
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
  },
  data() {
    return {
      urn: '',
    }
  },
  computed: {
    conversation() {
      return this.$store.getters['ms/getMessages'](this.urn)
    },
    // messages: function() {
    //   return this.conversation.messages
    // },
    profile() {
      return this.$store.getters['ps/getUser']
    },
    sender() {
      return this.$store.getters['ms/getConversationByContext'](this.context)
        .sender
    },
  },
  methods: {
    isMessageSendByMe(id) {
      return id === this.$store.getters['ps/getProfile'].id
    },
  },
  async created() {
    //This.context is the urn as path parameter in URL.
    //In this URN the : needs to be replaced else javascript wont like it being used as a key
    await this.$store.dispatch('ms/fetchMessagesByContext', {
      context: this.context,
    })
    this.urn = (' ' + this.context.replace(/:/gi, '')).slice(1)
  },
  mounted: function() {
    this.$store.commit('ui/showBackButton')
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
