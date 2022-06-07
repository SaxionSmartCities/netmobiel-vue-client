<template>
  <content-pane>
    <v-row dense>
      <!-- Never visible in ordinary case -->
      <v-col> Verwerken van de gegevens... </v-col>
    </v-row>
    <v-row v-if="error" dense>
      <v-col>
        Verwerken van de gegevens is niet gelukt. Druk op 'Home' om verder te
        gaan.
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as psStore from '@/store/profile-service'
import * as uiStore from '@/store/ui'

export default {
  name: 'SurveyCompletedPage',
  components: { ContentPane },
  props: {
    incentiveCode: { type: String, required: false, default: undefined },
  },
  data() {
    return {
      error: false,
    }
  },
  mounted() {
    if (!this.incentiveCode) {
      uiStore.actions.queueErrorNotification(
        `De afronding van de enquête kon niet geregistreerd worden. De enquête ID ontbreekt.`
      )
    } else {
      psStore.actions
        .fetchSurveys({ incentiveCode: this.incentiveCode })
        .then((page) => {
          // If no survey could be found, it has expired or already marked as submitted
          if (page && page.totalCount === 1) {
            return psStore.actions.markSurveySubmitted(page.data[0].urn)
          } else {
            uiStore.actions.queueErrorNotification(
              `De afronding van de enquête kon niet geregistreerd worden. De enquête is al geregistreerd of de vervaltermijn is inmiddels verstreken.`
            )
            return Promise.reject()
          }
        })
        .then(() => {
          psStore.mutations.setSurveyInteraction(null)
          this.$router.push({ name: 'home' })
        })
        .catch(() => {})
    }
  },
}
</script>

<style scoped></style>
