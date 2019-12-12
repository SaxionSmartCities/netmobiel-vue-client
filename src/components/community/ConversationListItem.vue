<template>
  <v-list-item :key="conversation.id">
    <v-list-item-avatar>
      <v-img class="profileimage" :src="require('@/assets/profile_img.png')" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        <span class="title"> {{ conversation.sender }}</span>
      </v-list-item-title>
      <v-list-item-subtitle class="py-2">
        <span class="body-1">
          {{ conversation.messages[0].content }}
        </span>
        <!-- <round-badge :value="10"></round-badge> -->
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-content class="col-2">
      <v-list-item-title>
        12:45
      </v-list-item-title>
      <v-list-item-subtitle class="caption py-2">
        <round-badge :value="10"></round-badge>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import RoundBadge from '@/components/common/RoundBadge.vue'

export default {
  name: 'ConversationList',
  components: {
    RoundBadge,
  },
  props: {
    conversation: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss"></style>
