<template>
  <content-pane>
    <v-row>
      <v-col>
        Overview of delegators
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
export default {
  name: 'DelegationOverview',
  components: { ContentPane },
  mounted() {
    this.$store.commit('ui/showBackButton')
  },
}
</script>

<style scoped></style>
