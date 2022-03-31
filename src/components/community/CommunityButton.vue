<template>
  <v-card outlined max-width="220" :disabled="disabled" @click="toNextPage">
    <v-row wrap no-gutters>
      <v-col>
        <v-card-text>
          <v-row no-gutters>
            <v-col class="text-center">
              <v-badge
                offset-x="1"
                offset-y="6"
                color="red"
                :value="counter !== 0"
                :content="counter"
              >
                <v-icon>{{ icon }}</v-icon>
              </v-badge>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="text-center">
              <div>{{ name }}</div>
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
    counter: {
      type: Number,
      default: 0,
      required: false,
    },
    icon: {
      type: String,
      default: null,
      required: true,
    },
    name: {
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
      required: false,
      default: false,
    },
  },
  methods: {
    toNextPage: function () {
      if (this.forward) {
        this.$router.push({ name: this.forward })
      }
    },
  },
}
</script>

<style></style>
