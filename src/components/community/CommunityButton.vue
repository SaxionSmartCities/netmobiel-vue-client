<template>
  <v-container>
    <div class="text-center">
      <v-btn x-large outlined color="indigo" :to="forward">
        <div class="compact-form">
          <v-badge
            overlap
            color="red"
            :value="aantalBerichten"
            :content="aantalBerichten"
          >
            <v-icon>{{ icon }}</v-icon>
          </v-badge>
          <div>{{ naam }}</div>
        </div>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    aantalBerichten: {
      type: Number,
      default: 0,
      required: false,
    },
    icon: {
      type: String,
      required: true,
    },
    naam: {
      type: String,
      required: true,
    },
    forward: {
      type: String,
      required: false,
    },
  },
}
</script>

<style>
.compact-form {
  transform: scale(0.8);
  transform-origin: center;
}
</style>
