<template>
  <v-container class="full-height">
    <iframe src="https://www.netmobiel.eu/privacyverklaring-app/" />
  </v-container>
</template>

<script>
import * as uiStore from '@/store/ui'

export default {
  components: {},
  created() {
    uiStore.mutations.showBackButton()
  },
}
</script>

<style lang="scss" scoped></style>
