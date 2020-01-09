<template>
  <v-container class="flex-grow-0">
    <v-row>
      <v-col cols="3">
        <v-img
          class="profileimage"
          :src="require('@/assets/profile_img.png')"
        />
      </v-col>
      <v-col>
        <h2>Henk van der Laan</h2>
      </v-col>
    </v-row>
    <v-divider />
    <v-row class="flex-grow-1">
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
    <v-row>
      <v-col>
        <v-text-field></v-text-field>
      </v-col>
    </v-row>
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
