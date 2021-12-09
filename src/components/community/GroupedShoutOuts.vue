<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col>
          <h4 class="netmobiel">{{ label }}</h4>
        </v-col>
      </v-row>
      <v-row v-for="(shoutOut, index) in shoutOuts" :key="index">
        <v-col>
          <shout-out
            :shout-out="shoutOut"
            @shoutOutSelected="onShoutOutSelected"
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
    shoutOuts: { type: Array, required: true, default: () => [] },
    proposedRides: { type: Array, required: false, default: () => [] },
  },
  methods: {
    onShoutOutSelected(selected) {
      this.$emit('shoutOutSelected', selected)
    },
  },
}
</script>
