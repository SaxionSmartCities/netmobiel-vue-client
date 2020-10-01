<template>
  <v-row>
    <v-col v-if="noCompliments">
      Nog geen complimenten ontvangen.
    </v-col>
    <v-col v-else>
      <div class="compliments-container">
        <div
          v-for="compliment in Object.keys(compliments)"
          :key="compliment"
          class="compliment"
        >
          <span class="body-2">{{ compliment }}</span>
          <div class="tip caption">{{ compliments[compliment] }}</div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Compliments',
  props: {
    compliments: { type: Object, required: true },
  },
  computed: {
    noCompliments() {
      return !this.compliments || Object.keys(this.compliments).length === 0
    },
  },
}
</script>

<style lang="scss" scoped>
.compliments-container {
  display: flex;
  justify-content: space-between;
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
