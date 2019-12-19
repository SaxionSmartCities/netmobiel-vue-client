<template>
  <v-container>{{ id }}</v-container>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  mounted: function() {
    console.log(this.id)
  },
}
</script>

<style></style>
