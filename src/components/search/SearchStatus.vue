<template>
  <v-row dense>
    <v-col class="box-widget background-white" shrink>
      <v-row>
        <v-col cols="3" xs-3 mt-2>
          <v-progress-circular indeterminate class="rotate">
          </v-progress-circular>
        </v-col>
        <v-col>
          <h3>Zoekopdracht is verstuurd!</h3>
          <p>Even geduld...</p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'SearchStatus',
}
</script>

<style scoped lang="scss">
.rotate {
  color: #ff8500;
}
</style>
