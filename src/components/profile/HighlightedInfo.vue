<template>
  <div class="user-info-highlight">
    <div class="d-flex flex-column">
      <span class="text-color-primary">
        205
      </span>
      <span class="subtitle-1">
        Ritten <br />
        gereden
      </span>
    </div>
    <div class="d-flex flex-column text-center">
      <span v-if="compliments" class="text-color-primary">
        {{ totalCompliments }}
      </span>
      <span class="subtitle-1">
        Complimenten <br />
        gekregen
      </span>
    </div>
    <div class="d-flex flex-column text-center">
      <span class="text-color-primary">
        169
      </span>
      <span class="subtitle-1">
        Credits <br />
        gedoneerd
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HighlightedInfo',
  props: {
    drivenRides: { type: Number, required: false, default: 0 },
    complimentsReceived: { type: Number, required: false, default: 0 },
    donatedCredits: { type: Number, required: false, default: 0 },
  },
}
</script>

<style lang="scss" scoped>
.user-info-highlight {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border: 1px solid $color-light-grey;
  border-radius: $border-radius;
  padding: 10px;
  * {
    text-align: left;
  }
  div {
    &:nth-child(2) {
      padding: 0 10px;
      border-right: 1px solid $color-white-grey;
      border-left: 1px solid $color-white-grey;
    }
  }
}
</style>
