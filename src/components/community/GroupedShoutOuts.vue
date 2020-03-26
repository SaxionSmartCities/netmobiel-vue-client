<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col class="py-0">
          <h4 class="netmobiel">{{ label }}</h4>
        </v-col>
      </v-row>
      <v-row v-for="(shoutout, index) in shoutouts" :key="index">
        <v-col>
          <shout-out
            :shoutout="shoutout"
            @shoutoutSelected="onShoutoutSelected"
          ></shout-out>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ShoutOut from '@/components/community/ShoutOut'

export default {
  name: 'GroupedShoutOuts',
  components: { ShoutOut },
  props: {
    label: { type: String, required: true },
    shoutouts: { type: Array, required: true },
  },
  methods: {
    onShoutoutSelected(index) {
      this.$emit('shoutoutSelected', index)
    },
  },
}
</script>
