<template>
  <a
    :href="getHref"
    target="_blank"
    class="text-decoration-none"
    @click="onClick"
  >
    <slot name="anchorBody" />
  </a>
</template>

<script>
import { allowExternalLinks } from '@/utils/Utils'

export default {
  name: 'ExternalLink',
  props: {
    href: { type: String, required: true },
  },
  data() {
    return {
      enabled: allowExternalLinks(),
    }
  },
  computed: {
    getHref() {
      return this.enabled ? this.href : false
    },
  },
  methods: {
    onClick() {
      if (!this.enabled) {
        this.$emit('link-disabled', this.href)
      }
    },
  },
}
</script>

<style scoped></style>
