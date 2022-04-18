<template>
  <div class="d-flex flex-column full-height">
    <slot name="header"></slot>
    <v-container
      ref="scrollableContainer"
      class="justify-center align-content-start full-height"
      :class="{
        'container-non-scrollable': !scrollable,
        'container-scrollable': scrollable,
      }"
    >
      <slot></slot>
    </v-container>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import { throttle } from 'lodash'

export default {
  props: {
    scrollable: {
      type: Boolean,
      required: false,
      default: true,
    },
    // The percentage of the client height left over beyond the bottom where a low water signal will be issued
    lowWater: {
      type: Number,
      required: false,
      default: 66,
    },
  },
  data() {
    return {
      bottom: false,
      scrollHandler: throttle(() => {
        this.bottom = this.isBottomNearby(this.$refs.scrollableContainer)
      }, 500),
    }
  },
  watch: {
    bottom(newValue) {
      // console.log(`Bottom ${oldValue} --> ${newValue}`)
      if (newValue) {
        this.$emit('low')
      }
    },
  },
  mounted() {
    if (this.scrollable && this.$listeners.low) {
      this.$refs.scrollableContainer.addEventListener(
        'scroll',
        this.scrollHandler
      )
    }
  },
  beforeDestroy() {
    if (this.scrollable && this.$listeners.low) {
      this.$refs.scrollableContainer.removeEventListener(
        'scroll',
        this.scrollHandler
      )
    }
  },
  methods: {
    isBottomNearby(element) {
      const st = element.scrollTop
      const ch = element.clientHeight
      const sh = element.scrollHeight
      const lowWaterHeight = Math.round(ch * (this.lowWater / 100))
      const bp = st + ch + lowWaterHeight
      const nearby = bp >= sh || sh < ch
      // console.log(`Scroll: ST ${st} ch ${ch} sh ${sh} bp ${bp} nb ${nearby}`)
      return nearby
    },
  },
}
</script>

<style scoped lang="scss">
.container-non-scrollable {
  overflow: hidden !important;
}

.container-scrollable {
  overflow: auto;
}
</style>
