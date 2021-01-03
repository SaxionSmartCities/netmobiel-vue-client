<template>
  <content-pane>
    <template v-slot:header>
      <tab-bar
        v-if="showTabs"
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template v-slot:firstTab>
          <v-icon color="white">commute</v-icon>
          <span>
            Passagier
          </span>
        </template>
        <template v-slot:secondTab>
          <v-icon color="white">directions_car</v-icon>
          <span>
            Chauffeur
          </span>
        </template>
      </tab-bar>
    </template>
    <v-row v-if="(showTabs && selectedTab === 0) || isPassenger" dense>
      <v-col>
        Passagier
      </v-col>
    </v-row>
    <v-row v-if="(showTabs && selectedTab === 1) || isDriver" dense>
      <v-col>
        Chauffeur
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import TabBar from '../../components/common/TabBar'
import constants from '../../constants/constants'
import * as psStore from '@/store/profile-service'
import * as uiStore from '@/store/ui'

export default {
  components: {
    ContentPane,
    TabBar,
  },
  data() {
    return {
      selectedTab: 0,
    }
  },
  computed: {
    showTabs() {
      const role = psStore.getters.getProfile.userRole
      return !role || role === constants.PROFILE_ROLE_BOTH
    },
    isPassenger() {
      const role = psStore.getters.getProfile.userRole
      return role === constants.PROFILE_ROLE_PASSENGER
    },
    isDriver() {
      const role = psStore.getters.getProfile.userRole
      return role === constants.PROFILE_ROLE_DRIVER
    },
  },
  mounted() {
    uiStore.mutations.showBackButton()
  },
}
</script>

<style lang="scss"></style>
