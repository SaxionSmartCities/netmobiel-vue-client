<template>
  <v-card outlined :style="cardStyle">
    <v-card-title class="flex flex-row justify-start flex-nowrap">
      <v-icon class="mr-4">new_releases</v-icon>
      <span class="subtitle-1">{{ updateMessage.title }}</span>
    </v-card-title>
    <v-card-text class="body-2">
      {{ updateMessage.content }}
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        v-if="updateMessage.link && updateMessage.link.to"
        rounded
        outlined
        color="primary"
        :to="updateMessage.link.to"
      >
        {{ updateMessage.link.label }}
      </v-btn>
      <v-btn
        v-else-if="updateMessage.link && updateMessage.link.href"
        rounded
        outlined
        color="primary"
        @click="redirect(updateMessage.link)"
      >
        {{ updateMessage.link.label }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    updateMessage: {
      type: Object,
      required: true,
    },
    cardStyle: {
      type: String,
      required: false,
      default: '',
    },
  },
  methods: {
    redirect: function (link) {
      let callback = () => Promise.resolve()
      if (typeof link.notification === 'function') {
        callback = link.notification
      }
      callback().then(() => {
        window.location.href = link.href
        return null
      })
    },
  },
}
</script>

<style lang="scss"></style>
