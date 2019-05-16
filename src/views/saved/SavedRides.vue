<template>
  <div>
    <v-tabs id="tabs" grow centered slider-color="#bddade">
      <v-tab class="white--text" @click="geplandClick">Gepland</v-tab>
      <v-tab class="white--text" @click="archiefClick">Archief</v-tab>
    </v-tabs>
    <div>
      <v-container fluid>
        <v-layout justify-center align-center column>
          <v-flex>
            <div v-if="archief === false">
              <v-card-text>Je hebt nog niets gepland</v-card-text>
              <v-btn round large block>
                Plan je reis
              </v-btn>
            </div>
            <div v-else>
              <v-card-text>Je hebt nog niets in je archief!</v-card-text>
              <v-btn round large block>
                Plan je reis
              </v-btn>
            </div>
          </v-flex></v-layout
        >
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Saved',
  data: function() {
    return {
      archief: false,
    }
  },
  methods: {
    geplandClick: function() {
      this.archief = false
    },
    archiefClick: function() {
      this.archief = true
    },
  },
}
</script>

<style lang="scss">
.theme--light.v-tabs__bar {
  background-color: $color-green;
}
.v-tabs__slider {
  height: 4px;
}
.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: $color-orange;
  color: white;
}
</style>
