<template>
  <v-img :src="path" max-width="100" contain="contain" />
</template>

<script>
export default {
  name: 'ImageViewer',
  props: {
    path: { type: String, required: true },
  },
}
</script>
