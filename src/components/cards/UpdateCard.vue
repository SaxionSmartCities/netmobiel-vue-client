<template>
  <v-card outlined>
    <v-row>
      <v-col align="center">
        <v-icon>new_releases</v-icon>
      </v-col>
      <v-col cols="8">
        <v-row>
          <h3>{{ updateMessage.title }}</h3>
        </v-row>
        <v-row>
          <p>{{ updateMessage.content }}</p>
        </v-row>
        <v-row v-if="updateMessage.link !== undefined" justify="end">
          <a
            v-if="updateMessage.link.to.startsWith('https')"
            :href="updateMessage.link.to"
            class="v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--rounded v-btn--router theme--light v-size--default"
            target="_blank"
          >
            {{ updateMessage.link.label }}
          </a>
          <v-btn v-else rounded outlined :to="updateMessage.link.to">
            {{ updateMessage.link.label }}
          </v-btn>
        </v-row>
      </v-col>
      <v-col align="center">
        <v-icon @click="popMessage">close</v-icon>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import * as uiStore from '@/store/ui'

export default {
  props: {
    updateMessage: {
      type: Object,
      required: true,
    },
  },
  methods: {
    popMessage: function() {
      uiStore.mutations.shiftUpdateMessage()
    },
  },
}
</script>

<style lang="scss"></style>
