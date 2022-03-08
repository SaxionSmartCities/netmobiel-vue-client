<template>
  <v-row>
    <v-col v-if="noCompliments"> Nog geen complimenten ontvangen. </v-col>
    <v-col v-else>
      <div class="compliments-container">
        <div
          v-for="compliment in Object.keys(filteredCompliments)"
          :key="compliment"
          class="compliment"
        >
          <span class="body-2">{{ displayName(compliment) }}</span>
          <div class="tip caption">{{ filteredCompliments[compliment] }}</div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import constants from '@/constants/constants'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Compliments',
  props: {
    compliments: { type: Object, required: true },
  },
  computed: {
    noCompliments() {
      return (
        !this.filteredCompliments ||
        Object.keys(this.filteredCompliments).length === 0
      )
    },
    filteredCompliments() {
      return Object.entries(this.compliments)
        .filter(([, value]) => value > 0)
        .reduce((previous, [ckey, cvalue]) => {
          previous[ckey] = cvalue
          return previous
        }, {})
    },
  },
  methods: {
    displayName(complimentCode) {
      return constants.COMPLIMENT_MAPPING[complimentCode]
    },
  },
}
</script>

<style lang="scss" scoped>
.compliments-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 0 - 4px;
  .compliment {
    margin: 5px 4px;
    background-color: $background-light-green;
    color: $color-green;
    font-weight: $font-bold;
    padding: 8px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    position: relative;
  }
  .tip {
    position: absolute;
    left: calc(100% - 12px);
    bottom: 60%;
    color: white;
    background-color: $color-primary;
    border-radius: 50%;
    padding: 2px;
    width: 25px;
  }
}
</style>
