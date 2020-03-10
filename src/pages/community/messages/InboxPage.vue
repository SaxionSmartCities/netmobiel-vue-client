<template>
  <content-pane :clearpadding="true">
    <template v-slot:header>
      <v-tabs
        id="tabs"
        v-model="selectedTab"
        grow
        centered
        slider-color="#bddade"
      >
        <v-tab class="white--text no-caps saved">
          <span>Recent</span>
        </v-tab>
        <v-tab class="white--text no-caps saved">
          <span>Archief</span>
        </v-tab>
      </v-tabs>
    </template>
    <v-list three-line avatar class="pt-0 conversation-list">
      <template v-for="conversation in conversations">
        <v-divider :key="conversation.context + '-divider'" />
        <v-list-item
          :key="conversation.context"
          class=""
          @click="showConversation(conversation.context)"
        >
          <v-list-item-avatar size="60">
            <!--                  <v-img :src="profile.image" />-->
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <v-row dense>
                <v-col>
                  {{ conversation.sender.givenName }}
                </v-col>
                <v-col class="px-2" cols="2">
                  <div class="message-counter">4</div>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>{{ conversation.body }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'

export default {
  components: {
    ContentPane,
  },
  data() {
    return {
      selectedTab: 0,
    }
  },
  computed: {
    conversations() {
      return this.$store.getters['ms/getConversations']
        ? this.$store.getters['ms/getConversations']
        : []
    },
    profile() {
      return this.$store.getters['ps/getUser']
    },
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
    this.$store.dispatch('ms/fetchMessages')
    this.$store.dispatch('ms/fetchConversations')
  },
  methods: {
    showConversation(context) {
      this.$router.push({
        path: `/conversation/${context}`,
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
