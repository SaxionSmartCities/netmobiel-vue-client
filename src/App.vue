<template>
  <div id="app">
    <netmobiel-header id="header" />

    <div id="content">
      <router-view></router-view>
    </div>

    <netmobiel-footer id="footer" />
  </div>
</template>

<script>
import NetmobielHeader from '@/views/common/NetmobielHeader.vue'
import NetmobielFooter from '@/views/common/NetmobielFooter.vue'

export default {
  name: 'App',
  components: {
    NetmobielHeader,
    NetmobielFooter,
  },
}
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#header {
  justify-self: flex-start;
  height: 10vmin;
}

#content {
  flex: 1 0 auto;
}

#footer {
  // height: 5vh;
  justify-self: flex-end;
}
</style>
