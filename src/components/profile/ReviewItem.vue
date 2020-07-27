<template>
  <div>
    <span>{{ hello }}</span>
  </div>
</template>

<script>
export default {
  name: 'ReviewItem',
  props: {
    review: { type: Object, required: true },
  },
}
</script>

<style scoped></style>
