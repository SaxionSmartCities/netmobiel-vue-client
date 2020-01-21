<template>
  <content-pane :clearpadding="true">
    <template v-slot:header>
      <v-container class="py-1">
        <v-row dense>
          <v-col cols="3">
            <v-img class="profileimage" :src="getUserData().image" />
          </v-col>
          <v-col align-self="center">
            <h2>Henk van der Laan</h2>
          </v-col>
        </v-row>
        <v-divider class="mt-1" />
      </v-container>
    </template>
    <v-row dense>
      <v-col>
        <template v-for="(message, index) in messages">
          <v-row :key="index">
            <v-col class="py-1">
              <message-card :message="message" />
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
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import MessageCard from '@/components/community/MessageCard.vue'

export default {
  components: {
    ContentPane,
    MessageCard,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    messages: function() {
      return [
        {
          content: 'Hallo',
          sender: 'Henk',
          timeStamp: moment()
            .subtract(1, 'day')
            .add(2, 'hours'),
        },
        {
          content: 'Hoi',
          sender: 'You',
          timeStamp: moment(),
        },
        {
          content: 'ben je dr nog?',
          sender: 'You',
          timeStamp: moment(),
        },
        {
          content: 'Henk??? HENK!!!! NEEEEEEE',
          sender: 'You',
          timeStamp: moment(),
        },
        {
          content: 'Jaja ff rustig..',
          sender: 'Henk',
          timeStamp: moment(),
        },
      ]
    },
  },
  mounted: function() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    getUserData() {
      return this.$store.getters['ps/getUser']
    },
  },
}
</script>

<style lang="scss"></style>
