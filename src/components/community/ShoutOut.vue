<template>
  <v-card
    fluid
    class="shoutout-container"
    @click="$emit('shoutoutSelected', index)"
  >
    <v-row>
      <v-col class="shrink">
        <v-img class="shoutout-image" :src="profile.image" />
      </v-col>
      <v-col class="shrink">
        <div class="d-flex flex-column">
          <span class="font-weight-regular subtitle-2">Reiziger</span>
          <span class="subtitle-1 font-weight-light">Netmobiel</span>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end">
          <v-icon>chevron_right</v-icon>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <span class="text-color-primary body-1 pr-2">+5 credits</span>
          <v-btn small rounded depressed color="button">Rit aanbieden</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'ShoutOut',
  props: {
    index: { type: Number, required: true },
  },
  computed: {
    profile() {
      return this.$store.getters['ps/getUser']
    },
  },
  methods: {
    doSomething() {},
  },
}
</script>

<style lang="scss" scoped>
.shoutout-container {
  padding: 15px;

  .shoutout-image {
    padding-right: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
</style>
