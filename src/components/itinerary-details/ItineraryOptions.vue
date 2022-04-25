<template>
  <v-row>
    <v-col>
      <v-row v-if="options.length === 0">
        <v-col>
          <v-divider></v-divider>
          <em>Geen wijzigingen mogelijk.</em>
        </v-col>
      </v-row>
      <v-row v-for="(option, index) in options" :key="index">
        <v-col>
          <v-divider></v-divider>
          <v-row class="mt-1 clickable-item" @click="option.callback">
            <v-col cols="1">
              <v-icon>{{ option.icon }}</v-icon>
            </v-col>
            <v-col>
              {{ option.label }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col><v-divider></v-divider></v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ItineraryOptions',
  props: {
    options: { type: Array, default: () => [] },
  },
}
</script>
