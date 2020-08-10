<template>
  <content-pane>
    <v-row>
      <v-col class="pa-0 ">
        <h1 class="headline">Instellingen</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0">
        <h2
          class="mt-4 text-uppercase caption font-weight-bold text-color-primary"
        >
          Gebruik netmobiel als
        </h2>
        <single-select
          v-if="selectedMode"
          class="mt-1"
          :active-option="selectedMode"
          :options="profileOptions"
          :init-value="selectedMode"
          @change="onModeChange"
        ></single-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 mt-4">
        <div
          v-for="section in Object.keys(notificationSettings[selectedMode])"
          :key="section"
        >
          <span
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            {{ section }}
          </span>
          <v-divider></v-divider>
          <template
            v-for="(option, index) in notificationSettings[selectedMode][
              section
            ]"
          >
            <v-row :key="option.title" justify="space-between">
              <v-col class="d-flex align-center">
                <span class="body-2">{{ option.title }}</span>
              </v-col>
              <v-col class="shrink d-flex align-center">
                <v-switch
                  class="switch-overwrite"
                  hide-details
                  inset
                  :value="false"
                ></v-switch>
              </v-col>
            </v-row>
            <v-divider
              v-if="
                index !== notificationSettings[selectedMode][section].length - 1
              "
              :key="index"
            ></v-divider>
          </template>
        </div>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../components/common/ContentPane'
import notification_settings from '../../config/notification_settings'
import SingleSelect from '../../components/profile/SingleSelect'
import { throttle } from 'lodash'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

export default {
  name: 'NotificationOptions',
  components: { SingleSelect, ContentPane },
  data() {
    return {
      title: 'Instellingen',
      notificationSettings: notification_settings,
      selectedMode: null,
      profileOptions: [
        { title: 'Reiziger', value: 'passenger' },
        { title: 'Reiziger + Chauffeur', value: 'both' },
        { title: 'Chauffeur', value: 'driver' },
      ],
    }
  },
  computed: {
    notificationOptions() {
      return psStore.getters.getUser.notificationOptions
    },
    tripOptions() {
      return psStore.getters.getUser.tripOptions
    },
    userRole() {
      return psStore.getters.getProfile.userRole
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    if (!this.userRole) {
      this.selectedMode = 'both'
    } else {
      this.selectedMode = this.userRole
    }
  },
  methods: {
    onModeChange: throttle(function(option) {
      this.selectedMode = option.value
      let profile = { ...psStore.getters.getProfile }
      profile.userRole = option.value
      psStore.actions.updateProfile(profile)
    }),
  },
}
</script>
<style lang="scss" scoped>
.switch-overwrite {
  &.v-input--selection-controls {
    margin-top: 0px;
  }
}
.v-input__control {
  height: 32px !important;
}
</style>
