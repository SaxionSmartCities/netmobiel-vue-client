<template>
  <v-card>
    <v-row>
      <v-col cols="2" align-self="center">
        <v-row>
          <v-col justify-self="center">
            <v-img
              center
              class="profileimage"
              :src="require('@/assets/profile_img.png')"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row>
          <v-col>{{ sender }}</v-col>
        </v-row>
        <v-row>
          <v-col>{{ displayMessage.content }}</v-col>
        </v-row>
      </v-col>
      <v-col cols="2">
        <v-row align="start">
          <v-col>{{ displayMessage.timeStamp }}</v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-badge>
              <template v-slot:badge>{{ unreadMessages }}</template>
              <v-icon>mail</v-icon>
            </v-badge>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
// import RoundUserImage from '@/components/common/RoundUserImage.vue'

export default {
  name: 'ConversationCard',
  components: {
    // RoundUserImage,
  },
  props: {
    sender: {
      type: String,
      required: true,
    },
    displayMessage: {
      type: Object,
      required: true,
    },
    relatedBooking: {
      type: Object,
      required: false,
      default: null,
    },
    unreadMessages: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style lang="scss"></style>
