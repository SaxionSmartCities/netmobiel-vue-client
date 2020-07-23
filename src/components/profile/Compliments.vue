<template>
  <div class="compliments-container">
    <div v-for="compliment in Object.keys(compliments)" :key="compliment"></div>
  </div>
</template>

<script>
export default {
  name: 'Compliments',
  props: {
    compliments: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.compliments-container {
  display: flex;
}
</style>
