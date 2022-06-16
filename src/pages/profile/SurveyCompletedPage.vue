<template>
  <content-pane>
    <v-row dense>
      <v-col><h1>Enquêteafronding</h1></v-col>
    </v-row>
    <v-row dense class="text-body-1">
      <v-col>
        <span v-if="!error"> Verwerken van de gegevens... </span>
        <span v-else>
          Verwerken van de afronding van de enquête is helaas niet gelukt.
        </span>
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
  computed: {
    isAppLoaded() {
      return uiStore.getters.isAppLoaded
    },
  },
  watch: {
    isAppLoaded() {
      if (this.isAppLoaded) {
        this.processSurveyCompetion()
      }
    },
  },
  mounted() {
    if (this.isAppLoaded) {
      this.processSurveyCompetion()
    }
  },
  methods: {
    processSurveyCompetion() {
      if (!this.incentiveCode) {
        uiStore.actions.queueErrorNotification(
          `De afronding van de enquête kan niet geregistreerd worden, want de enquête ID ontbreekt.`
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
                `De enquête kon niet gevonden worden, of is reeds afgemeld, of de vervaltermijn is inmiddels verstreken.`
              )
              return Promise.reject()
            }
          })
          .then(() => {
            psStore.mutations.setSurveyInteraction(null)
            this.$router.push({ name: 'home' })
          })
          .catch(() => {
            this.error = true
          })
      }
    },
  },
}
</script>

<style scoped></style>
