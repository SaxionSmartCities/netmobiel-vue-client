<template>
  <content-pane>
    <onboarding-navigation title="Account toevoegen" />
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import OnboardingNavigation from '@/components/onboarding/OnboardingNavigation.vue'
import * as uiStore from '@/store/ui'

export default {
  name: 'DelegationOverview',
  components: { ContentPane, OnboardingNavigation },
  mounted() {
    uiStore.mutations.showBackButton()
  },
}
</script>
