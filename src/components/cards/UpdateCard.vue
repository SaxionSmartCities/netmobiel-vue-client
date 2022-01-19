<template>
  <v-card outlined>
    <v-card-title>
      <v-row>
        <v-col class="text-center shrink">
          <v-icon>new_releases</v-icon>
        </v-col>
        <v-col>
          {{ updateMessage.title }}
        </v-col>
        <v-col class="text-center shrink">
          <v-icon @click="popMessage">close</v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ updateMessage.content }}
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        v-if="updateMessage.link && updateMessage.link.to"
        rounded
        outlined
        :to="updateMessage.link.to"
      >
        {{ updateMessage.link.label }}
      </v-btn>
      <v-btn
        v-else-if="updateMessage.link && updateMessage.link.href"
        rounded
        outlined
        @click="redirect(updateMessage.link)"
      >
        {{ updateMessage.link.label }}
      </v-btn>
    </v-card-actions>
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
    popMessage: function () {
      uiStore.mutations.shiftUpdateMessage()
    },
    redirect: function (link) {
      let callback = () => Promise.resolve()
      if (typeof link.notification === 'function') {
        callback = link.notification
      }
      callback().then(() => {
        console.log(`Redirect app`)
        window.location.href = link.href
        return null
      })
    },
  },
}
</script>

<style lang="scss"></style>
