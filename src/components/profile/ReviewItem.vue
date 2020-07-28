<template>
  <div class="review mb-4">
    <div class="info-row mb-2">
      <div>
        <round-user-image
          :profile-image="profileImage"
          :image-size="32"
          :avatar-size="37"
        >
        </round-user-image>
        <span class="body-1 ml-3">
          {{ review.sender.firstName + ' ' + review.sender.lastName }}
        </span>
      </div>
      <span class="caption align-self-center">
        {{ formatDate(review.published) }}
      </span>
    </div>
    <div>
      <span class="body-2">
        {{ review.review }}
      </span>
    </div>
    <div class="mt-2">
      <v-divider></v-divider>
    </div>
  </div>
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
      return moment(date)
        .locale('nl')
        .calendar()
    },
  },
}
</script>

<style lang="scss" scoped>
.review {
  display: flex;
  flex-direction: column;
  .info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
