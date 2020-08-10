<template>
  <content-pane :clearpadding="true">
    <template v-slot:header>
      <tab-bar
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template v-slot:firstTab>
          <span>Recent</span>
        </template>

        <template v-slot:secondTab>
          <span>Archief</span>
        </template>
      </tab-bar>
    </template>
    <v-list three-line avatar class="pt-0 conversation-list">
      <template v-for="conversation in conversations">
        <v-divider :key="conversation.context + '-divider'" />
        <v-list-item
          :key="conversation.context"
          class=""
          @click="showConversation(conversation)"
        >
          <v-list-item-avatar size="60">
            <!--                  <v-img :src="profile.image" />-->
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <v-row dense>
                <v-col>
                  {{
                    getReceiverViaConversationParticipants(
                      conversation.participants
                    )
                  }}
                </v-col>
                <v-col class="px-2" cols="2">
                  <div class="message-counter">4</div>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ conversation.context }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import TabBar from '../../../components/common/TabBar'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as msStore from '@/store/message-service'

export default {
  components: {
    TabBar,
    ContentPane,
  },
  data() {
    return {
      selectedTab: 0,
      // conversations: {},
    }
  },
  computed: {
    conversations() {
      return msStore.getters.getConversations
    },
    profile() {
      return psStore.getters.getUser
    },
    myId() {
      return psStore.getters.getProfile.id
    },
  },
  created: function() {
    uiStore.mutations.showBackButton()
    msStore.actions.fetchConversations()
  },
  methods: {
    getReceiverViaConversationParticipants(participants) {
      const res = participants.filter(
        user => user.managedIdentity !== this.myId
      )[0]
      if (res) {
        return res.givenName + ' ' + res.familyName
      }
      return 'not found'
    },
    showConversation(conversation) {
      this.$router.push({
        name: `conversation`,
        params: {
          context: conversation.context,
          participants: conversation.participants,
        },
      })
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
