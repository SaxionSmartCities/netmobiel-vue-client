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
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="dialog = false">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>User Controls</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Content filtering</v-list-tile-title>
              <v-list-tile-sub-title>Set the content filtering level to restrict apps that can be downloaded</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Password</v-list-tile-title>
              <v-list-tile-sub-title>Require password for purchase or use password to restrict purchase</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="notifications"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Notifications</v-list-tile-title>
              <v-list-tile-sub-title>Notify me about updates to apps or games that I downloaded</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="sound"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Sound</v-list-tile-title>
              <v-list-tile-sub-title>Auto-update apps at any time. Data charges may apply</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="widgets"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Auto-add widgets</v-list-tile-title>
              <v-list-tile-sub-title>Automatically add home screen widgets</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Saved',
  data: function() {
    return {
      archief: false,
      dialog: false,
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
