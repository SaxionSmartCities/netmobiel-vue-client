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
    direction: {
      type: String,
      required: false,
      default: 'bottom',
    },
    // The percentage of the client height left over beyond the bottom where a low water signal will be issued
    lowWater: {
      type: Number,
      required: false,
      default: 66,
    },
    // A hint to check the low water again
    contentStamp: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      boundaryNearby: false,
      scrollHandler: throttle(() => {
        this.$nextTick(() => {
          // console.log(`Scroll handler`)
          this.boundaryNearby = this.isBoundaryNearby(
            this.$refs.scrollableContainer
          )
        })
      }, 500),
    }
  },
  // NOTE: The algorithm will not detect an underflow, the case where the initial list is too short to fill
  // the screen. For now, choose the initial list size (maxResults) wisely.
  // MORE NOTES: When scrolling up fast, the (previous) top element is not scrolled into view, instead the list is just
  // extended to the bottom. The consequence is that the lowWater signal is not reset properly.
  // This algorithm is modified to signal too when the content (i.e. scrollHeight) in the child has changed.
  // The consequence is that when the scroll up is thrown to the top (in one swoosh), all content will be fetched in
  // successive steps and the top element will be visible.
  watch: {
    //eslint-disable-next-line
    boundaryNearby(newValue, oldValue) {
      // console.log(`boundaryNearby ${oldValue} --> ${newValue}`)
      if (newValue) {
        this.$emit('low')
      }
    },
    contentStamp() {
      // The child's content size has changed. Check the consequences.
      // console.log(`ContentPane: content updated`)
      this.$nextTick(() => {
        if (this.isBoundaryNearby(this.$refs.scrollableContainer)) {
          // OK, we are near the top (probably), notify child to load more content
          this.$emit('low')
        } else {
          // Well, obviously the boundary is not nearby. Reset it.
          this.boundaryNearby = false
        }
      })
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
    isBoundaryNearby(element) {
      if (!element) {
        return false
      }
      const st = element.scrollTop
      const ch = element.clientHeight
      const sh = element.scrollHeight
      const lowWaterHeight = Math.round(ch * (this.lowWater / 100))
      if (this.direction === 'bottom') {
        const boundaryNearbyMarker = st + ch + lowWaterHeight
        const nearby = boundaryNearbyMarker >= sh || sh < ch
        // console.log(
        //   `Direction bottom: st ${st} ch ${ch} sh ${sh} bp ${boundaryNearbyMarker} nb ${nearby}`
        // )
        return nearby
      } else if (this.direction === 'top') {
        const nearby = st < lowWaterHeight
        // console.log(`Direction top: st ${st} ch ${ch} sh ${sh} nb ${nearby}`)
        return nearby
      }
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
