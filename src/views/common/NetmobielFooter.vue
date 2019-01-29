<template>
    <div v-if="isVisible" class="placeholder">
    </div>
</template>

<script>
export default {
  name: 'Footer',
   computed: {
      isVisible: function() {
          return this.$store.getters.isFooterVisible;
      }
  }
}
</script>

<style scoped lang="scss">
.placeholder {
    background: $color-netmobiel-dark-green;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    height: 20px;
}
</style>
