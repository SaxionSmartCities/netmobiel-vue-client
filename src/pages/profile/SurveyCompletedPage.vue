<template>
  <content-pane>
    <v-row dense>
      <!-- Never visible in ordinary case -->
      <v-col> Verwerken van de gegevens... </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as psStore from '@/store/profile-service'

export default {
  name: 'SurveyCompletedPage',
  components: { ContentPane },
  props: {
    surveyId: { type: String, required: false, default: '' },
  },
  computed: {
    surveyInteraction() {
      // The App page triggers the fetching of the survey
      return psStore.getters.getSurveyInteraction
    },
  },
  watch: {
    surveyInteraction(newSurvey) {
      if (newSurvey?.survey) {
        this.surveySubmitted(newSurvey.survey.surveyId)
      }
    },
  },
  mounted() {
    if (this.surveyId) {
      this.surveySubmitted(this.surveyId)
    }
  },
  methods: {
    surveySubmitted(surveyId) {
      // console.log(`Mark ${surveyId} as completed`)
      psStore.actions
        .markSurveySubmitted(surveyId)
        .then(psStore.actions.fetchSurvey)
        .then(() => {
          this.$router.push({ name: 'home' })
        })
    },
  },
}
</script>

<style scoped></style>
