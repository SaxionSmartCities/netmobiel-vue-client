<template>
  <v-container id="app" fluid ma-0 pa-0>
    <v-layout fill-height column>
      <v-flex id="header" xs1>
        <netmobiel-header />
      </v-flex>
      <v-flex id="content" scroll>
        <router-view></router-view>
      </v-flex>
      <div id="footer">
        <netmobiel-footer />
      </div>
    </v-layout>
  </v-container>
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
  height: 100vh;
}

#header {
  height: 10vmax;
}

#footer {
  height: 56px;
}

.scroll {
  overflow-y: scroll;
}
</style>
