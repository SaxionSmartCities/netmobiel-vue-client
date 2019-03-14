<template>
    <div class="btn btn-block" v-bind:class="currentClass"  @click="buttonOnClick">
        <i :class="icon"></i>
    </div>
</template>

<script>
  export default {
    name: "ToggleButton",

    data: function () {
      return {
        selected: true,
        currentClass : "btn-primary"
      }
    },
    methods: {
      buttonOnClick() {
        console.log("buttonOnClick");
        this.selected = !this.selected;
        if (!this.selected) {
          this.currentClass = "btn-secondary"
        }else {
          this.currentClass= "btn-primary"
        }
      }
    },

    props: ["icon"],
  }
</script>

<style scoped>
    div{
        margin-top : 8px;
    }

</style>