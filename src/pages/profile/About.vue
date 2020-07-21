<template>
  <content-pane>
    <v-row>
      <v-col>
        <v-btn
          color="button"
          @click="$router.push({ name: 'rideSafeNetmobiel' })"
          >Corona-adviezen
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
export default {
  name: 'About',
  components: { ContentPane },
  mounted() {
    this.$store.commit('ui/showBackButton')
  },
}
</script>

<style scoped></style>
