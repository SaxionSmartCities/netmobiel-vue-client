<template>
  <v-row no-gutters>
    <v-col dense>
      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <round-user-image
            :profile-image="profileImage"
            :image-size="32"
            :avatar-size="37"
          />
          <span class="ml-3">
            {{ review.sender.firstName + ' ' + review.sender.lastName }}
          </span>
        </v-col>
        <v-col class="caption shrink review-date">
          {{ formatDate(review.published) }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          {{ review.review }}
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import moment from 'moment'

export default {
  name: 'ReviewItem',
  components: { RoundUserImage },
  props: {
    review: { type: Object, required: true },
    profileImage: { type: String, required: false, default: '' },
  },
  methods: {
    formatDate(date) {
      return moment(date).locale('nl').calendar()
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
