<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Wacht op bevestiging</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row class="d-flex flex-row justify-center">
      <v-col class="shrink">
        <v-progress-circular indeterminate color="button"></v-progress-circular>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        >We wachten op bevestiging van de storting door de
        betalingsinstelling...</v-col
      >
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import * as bsStore from '@/store/banker-service'
import * as uiStore from '@/store/ui'

// The return url from EMS pay, contains the project_id and the order_id
const pageUrl = new URL(location.href)
const checkInterval = 1000 // msec
const timeout = 5000 // msec

export default {
  name: 'WaitForDepositConfirmationPage',
  components: {
    ContentPane,
  },
  beforeRouteLeave(to, from, next) {
    // console.log(`beforeRouteLeave: ${from.name} --> ${to.name}`)
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
    }
    next()
  },
  data: function () {
    return {
      progressVisible: true,
      timer: undefined,
      count: 0,
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.checkDepositStatus()
    }, checkInterval)
  },
  methods: {
    // Check the deposit state. After X seconds a timeout occurs and an error message is displayed
    checkDepositStatus() {
      const paymentEvent = {
        project_id: pageUrl.searchParams.get('project_id'),
        order_id: pageUrl.searchParams.get('order_id'),
      }
      this.count++
      bsStore.actions
        // Us the callback url (this page) with query parameters provided by EMS pay
        .getDepositStatus(paymentEvent)
        .then(({ status }) => {
          // One of: ACTIVE, EXPIRED, COMPLETED, REQUESTED, CANCELLED
          let done = true
          if (status === 'COMPLETED') {
            // de overboeking is gelukt
            uiStore.actions.queueInfoNotification(`De storting is bevestigd!`)
          } else if (status === 'EXPIRED') {
            // Should never happen here, expiration time is days
            uiStore.actions.queueInfoNotification(`De storting is verlopen.`)
          } else if (status === 'CANCELLED') {
            // Never seen, but still...
            uiStore.actions.queueInfoNotification(
              `De storting is geannuleerd, probeer later opnieuw.`
            )
          } else if (this.count * checkInterval >= timeout) {
            uiStore.actions.queueErrorNotification(
              `De bevestiging is niet tijdig ontvangen.
              Het systeem controleert automatisch de storting op een later moment.`
            )
          } else {
            done = false
          }
          if (done) {
            this.$router.push({ name: 'credits' })
          }
        })
        .catch(() => {
          this.$router.push({ name: 'credits' })
        })
    },
  },
}
</script>
<style lang="scss" scoped></style>
