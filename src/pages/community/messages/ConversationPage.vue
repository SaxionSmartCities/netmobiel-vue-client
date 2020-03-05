<template>
  <content-pane :clearpadding="true">
    <div
      v-for="message in conversation"
      :key="message.id"
      class="d-flex flex-column"
    >
      <span>
        {{ message.body }}
      </span>
    </div>
    <!--    <template v-slot:header>-->
    <!--      <v-container class="py-1">-->
    <!--        <v-row dense>-->
    <!--          <v-col cols="3">-->
    <!--            <v-img class="profileimage" :src="profile.image" />-->
    <!--          </v-col>-->
    <!--          <v-col align-self="center">-->
    <!--            <h2>{{ conversation.sender }}</h2>-->
    <!--          </v-col>-->
    <!--        </v-row>-->
    <!--        <v-divider class="mt-1" />-->
    <!--      </v-container>-->
    <!--    </template>-->
    <!--    <v-row dense>-->
    <!--      <v-col>-->
    <!--        <template v-for="(message, index) in messages">-->
    <!--          <v-row :key="index">-->
    <!--            <v-col class="py-1">-->
    <!--              <message-card :message="message" />-->
    <!--            </v-col>-->
    <!--          </v-row>-->
    <!--        </template>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <!--    <template v-slot:footer>-->
    <!--      <v-row dense class="px-4 pb-1">-->
    <!--        <v-col class="pl-0">-->
    <!--          <v-text-field-->
    <!--            clearable-->
    <!--            outlined-->
    <!--            hide-details-->
    <!--            dense-->
    <!--            label="Typ een bericht"-->
    <!--          ></v-text-field>-->
    <!--        </v-col>-->
    <!--        <v-col cols="1" align-self="center">-->
    <!--          <v-icon class="send-icon">send</v-icon>-->
    <!--        </v-col>-->
    <!--      </v-row>-->
    <!--    </template>-->
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
// import MessageCard from '@/components/community/MessageCard.vue'

export default {
  components: {
    ContentPane,
    // MessageCard,
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
      console.log('convos', this.$store.getters['ms/getMessages'](this.urn))
      return this.$store.getters['ms/getMessages'](this.urn)
    },
    // messages: function() {
    //   return this.conversation.messages
    // },
    profile() {
      return this.$store.getters['ps/getUser']
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

<style lang="scss"></style>
