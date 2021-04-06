<template>
  <content-pane>
    <v-row>
      <v-col>
        <v-btn
          color="button"
          depressed
          block
          outlined
          @click="$router.push({ name: 'rideSafeNetmobiel' })"
          >Corona-adviezen
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as uiStore from '@/store/ui'

export default {
  name: 'About',
  components: { ContentPane },
  mounted() {
    uiStore.mutations.showBackButton()
  },
}
</script>

<style scoped></style>
