<template>
  <div @click="buttonOnClick">
    <div class="btn btn-block default" :class="{ toggled: isToggled }">
      <i id="iconId" :class="icon"> </i>
    </div>
    <label>{{ name }}</label>
  </div>
</template>

<script>
export default {
  name: 'ToggleButton',

  props: ['icon', 'name'],

  data: function() {
    return {
      isToggled: false,
    }
  },
  methods: {
    buttonOnClick() {
      console.log('buttonOnClick')
      this.isToggled = !this.isToggled
      this.$emit('toggle', this.isToggled)
    },
  },
}
</script>

<style scoped lang="scss">
div {
  margin-top: 8px;
}

.default {
  background: white;
  color: $netmobiel-dark-green;
}

.toggled {
  background: $netmobiel-dark-green;
  color: white;
}
</style>
