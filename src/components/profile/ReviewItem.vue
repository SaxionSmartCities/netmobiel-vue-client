<template>
  <v-row no-gutters>
    <v-col dense>
      <v-row dense>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="clickable-item" @click="onClick">
          <external-user-image
            :managed-identity="review.sender.id"
            :image-size="32"
            :avatar-size="38"
          />
          <span class="ml-3">
            {{ review.sender.firstName + ' ' + review.sender.lastName }}
          </span>
        </v-col>
        <v-col class="caption shrink review-date">
          {{ formatDate(review.published) }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          {{ review.review }}
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import ExternalUserImage from '@/components/profile/ExternalUserImage'

export default {
  name: 'ReviewItem',
  components: { ExternalUserImage },
  props: {
    review: { type: Object, required: true },
  },
  methods: {
    formatDate(date) {
      return moment(date).locale('nl').calendar()
    },
    onClick() {
      this.$router.push({
        name: 'userProfile',
        params: {
          profileId: this.review.sender.id,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.review-date {
  min-width: 100px;
  text-align: right;
}
</style>
