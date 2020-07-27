<template>
  <div class="review mt-4">
    <div class="info-row">
      <div>
        <round-user-image :image-size="32" :avatar-size="37">
        </round-user-image>
        <span class="body-1 ml-3">
          {{ review.sender.firstName + ' ' + review.sender.lastName }}
        </span>
      </div>
      <span class="caption align-self-center my-4">Gisteren</span>
    </div>
    <div>
      <span class="body-2">
        {{ review.review }}
      </span>
    </div>
    <div class="mt-4">
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
export default {
  name: 'ReviewItem',
  components: { RoundUserImage },
  props: {
    review: { type: Object, required: true },
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
