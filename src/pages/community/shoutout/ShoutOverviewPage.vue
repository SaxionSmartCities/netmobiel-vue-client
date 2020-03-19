<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Gezochte Reizen</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <shout-out></shout-out>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import ShoutOut from '@/components/community/ShoutOut'
export default {
  name: 'Shoutouts',
  components: { ShoutOut, ContentPane },
}
</script>

<style scoped></style>
