<template>
  <content-pane>
    <v-row align="center">
      <v-col class="px-0">
        <h3>Even geduld, a.u.b.</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row>
      <v-col>We controleren de overboeking bij de bank.</v-col>
    </v-row>
    <v-row>
      <v-col>{{ progress }}</v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import * as crsStore from '@/store/credits-service'
import * as uiStore from '@/store/ui'

const loc = new URL(location.href)

export default {
  name: 'WaitForDepositConfirmationPage',
  components: {
    ContentPane,
  },
  data: function() {
    return {
      progress: '',
    }
  },
  created() {
    const timer = setInterval(() => {
      this.progress = this.progress + '.'
    }, 50)
    const params = loc.searchParams
    crsStore.actions
      .getDepositStatus({
        project_id: params.get('project_id'),
        order_id: params.get('order_id'),
      })
      .then(({ status }) => {
        if (status === 'COMPLETED') {
          // de overboeking is gelukt
          uiStore.actions.queueInfoNotification(`Er zijn credits bijgeboekt.`)
          this.$router.push({ name: 'credits' })
        }
        //FIXME Kan zijn: ACTIVE, EXPIRED, COMPLETED, REQUESTED, CANCELLED
      })
      .finally(() => {
        clearInterval(timer)
      })
  },
}
</script>
<style lang="scss"></style>
