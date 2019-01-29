<template>
  <div id="app">
    <netmobiel-header/>

    <div id="content">
      <router-view></router-view>
    </div>

    <netmobiel-footer/>

  </div>
</template>

<script>
import NetmobielHeader from '@/views/common/NetmobielHeader.vue';
import NetmobielFooter from '@/views/common/NetmobielFooter.vue';

export default {
  name: 'app',
  components: {
    NetmobielHeader,
    NetmobielFooter
  }
}
</script>

<style lang="scss">
#app {
  font-family: $font-netmobiel-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $font-color;
}

.site-footer {
  position: absolute;
  bottom: 0;
}

body {
  background: $color-netmobiel-green;
}

small {
  color: $form-placeholder-font-color
}
</style>
