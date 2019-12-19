<template>
  <span class="round-badge text-white background-primary">
    {{ value }}
  </span>
</template>

<script>
export default {
  name: 'RoundBadge',
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.round-badge {
  padding: 5px 9px;
  border-radius: 1000px;
}
</style>
