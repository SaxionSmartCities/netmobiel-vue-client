<template>
  <v-row>
    <v-col class="py-0">
      <v-row v-if="options.length === 0">
        <v-col class="py-0">
          <v-divider></v-divider>
          <em>Geen wijzigingen mogelijk op dit moment.</em>
        </v-col>
      </v-row>
      <v-row v-for="(option, index) in options" :key="index" dense>
        <v-col class="py-0">
          <v-divider></v-divider>
          <v-row @click="option.callback">
            <v-col cols="1">
              <v-icon>{{ option.icon }}</v-icon>
            </v-col>
            <v-col class="pl-5">
              {{ option.label }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense>
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
