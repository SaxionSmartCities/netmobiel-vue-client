<template>
  <v-layout>
    <v-flex travel-card px-3 py-3>
      <v-layout>
        <v-flex xs1>
          <v-icon>new_releases</v-icon>
        </v-flex>
        <v-flex pl-2>
          <v-layout column>
            <v-flex>
              <h3>{{ updateMessage.title }}</h3>
            </v-flex>
            <v-flex>
              <p>{{ updateMessage.content }}</p>
            </v-flex>
            <v-flex>
              <v-layout justify-end>
                <v-btn
                  v-if="updateMessage.link !== undefined"
                  rounded
                  outlined
                  :to="updateMessage.link.to"
                >
                  {{ updateMessage.link.label }}
                </v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs1 @click="popMessage">
          <v-icon>close</v-icon>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    updateMessage: {
      type: Object,
      required: true,
    },
  },
  methods: {
    popMessage: function() {
      this.$store.commit('ui/shiftUpdateMessage')
    },
  },
}
</script>

<style lang="scss"></style>
