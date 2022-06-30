<template>
  <v-btn color="button" :to="cta.path" x-small rounded depressed>{{
    cta.label
  }}</v-btn>
</template>

<script>
export default {
  name: 'CallToAction',
  props: {
    cta: { type: Object, required: true },
  },
}
</script>
