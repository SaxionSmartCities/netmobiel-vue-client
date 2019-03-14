<template>
  <div class="btn btn-block default" v-bind:class="{toggled: isToggled}" @click="buttonOnClick">
    <i id="iconId" :class="icon"> </i>
  </div>
</template>

<script>
  export default {
    name: "ToggleButton",

    data: function () {
      return {
        isToggled: false,
      }
    },
    methods: {
      buttonOnClick() {
        console.log("buttonOnClick");
        this.isToggled = !this.isToggled;

      }
    },

    props: ["icon"],
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