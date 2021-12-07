<template>
  <content-pane>
    <onboarding-navigation title="Nieuw account" />
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import OnboardingNavigation from '@/components/onboarding/OnboardingNavigation.vue'
import * as uiStore from '@/store/ui'

export default {
  name: 'NewDelegationPage',
  components: { ContentPane, OnboardingNavigation },
  mounted() {
    uiStore.mutations.showBackButton()
  },
}
</script>
<style lang="scss">
.options {
  border: 1px solid gray;
  border-radius: 10px;
  padding-bottom: 0;
  padding-top: 0;

  span {
    // TODO: Find out what class defines the for the expansion panel.
    font-size: 15px;
  }
}

.switch-overwrite {
  margin-top: 0;
}
</style>
