<template>
  <content-pane>
    <template v-slot:header>
      <v-row dense>
        <v-col cols="3">
          <v-img
            class="profileimage"
            :src="require('@/assets/profile_img.png')"
          />
        </v-col>
        <v-col align-self="center">
          <h2>Henk van der Laan</h2>
        </v-col>
      </v-row>
      <v-divider />
    </template>
    <v-row dense>
      <v-col>
        <template v-for="(message, index) in messages">
          <v-row :key="index">
            <v-col>
              <message-card :message="message" />
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
    <template v-slot:footer>
      <v-row dense class="px-4 pb-1">
        <v-col>
          <v-text-field
            clearable
            outlined
            hide-details
            dense
            label="Stuur een bericht naar Henk van der Laan"
          ></v-text-field>
        </v-col>
        <v-col cols="1" align-self="center">
          <v-icon>send</v-icon>
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
          content: 'Henk??? HENK!!!! NEEEEEEEE',
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
}
</script>

<style></style>
