<template>
  <v-container>
    <v-row>
      <v-col>Henk van der laan TODO: object van maken</v-col>
    </v-row>
    <v-divider />
    <template v-for="(message, index) in messages">
      <v-row :key="index">
        <v-col>
          <message-card :message="message" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import moment from 'moment'
import MessageCard from '@/components/community/MessageCard.vue'

export default {
  components: {
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
    console.log(this.id)
  },
}
</script>

<style></style>
