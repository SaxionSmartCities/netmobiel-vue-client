<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Gezochte Reizen</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <shout-out
          :index="1"
          @shoutoutSelected="onShoutoutSelected"
        ></shout-out>
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
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    onShoutoutSelected(index) {
      this.$router.push({
        name: 'shoutout',
        params: { id: index },
      })
    },
  },
}
</script>

<style scoped></style>
