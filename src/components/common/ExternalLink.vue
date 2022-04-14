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
import constants from '@/constants/constants'

export default {
  name: 'ExternalLink',
  props: {
    href: { type: String, required: true },
  },
  data() {
    return {
      enabled: constants.EXTERNAL_LINKS_ALLOWED,
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
