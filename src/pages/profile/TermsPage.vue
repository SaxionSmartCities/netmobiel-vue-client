<template>
  <content-pane>
    <v-row dense>
      <v-col>
        <new-account-terms
          v-model="profile.consent"
          :read-only="true"
          @prev-step="$router.go(-1)"
        />
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as uiStore from '@/store/ui'
import NewAccountTerms from '@/components/onboarding/NewAccountTerms.vue'
import * as psStore from '@/store/profile-service'

export default {
  name: 'AboutPage',
  components: { ContentPane, NewAccountTerms },
  data: function () {
    return {
      consent: true,
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
  },
  mounted() {
    uiStore.mutations.showBackButton()
  },
}
</script>

<style scoped></style>
