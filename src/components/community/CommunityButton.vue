<template>
  <v-card outlined max-width="220" :disabled="disabled" @click="toNextPage">
    <v-row wrap no-gutters>
      <v-col>
        <v-card-text>
          <v-row no-gutters>
            <v-col align="center">
              <v-badge
                overlap
                color="red"
                :value="aantalBerichten"
                :content="aantalBerichten"
              >
                <v-icon>{{ icon }}</v-icon>
              </v-badge>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col align="center">
              <div>{{ naam }}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
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
      default: '',
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toNextPage: function () {
      this.$router.push({ name: this.forward })
    },
  },
}
</script>

<style></style>
