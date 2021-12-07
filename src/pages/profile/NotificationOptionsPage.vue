<template>
  <content-pane>
    <v-row>
      <v-col class="pa-0 ">
        <h1>Instellingen</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0">
        <h4 class="mt-4 mb-2 font-weight-bold text-color-primary">
          Gebruik netmobiel als
        </h4>
        <single-select
          v-if="selectedMode"
          :active-option="selectedMode"
          :options="profileOptions"
          :init-value="selectedMode"
          @change="onModeChange"
        ></single-select>
      </v-col>
    </v-row>
    <v-row>
      <profile-info-dialog :value="dialog" />
      <v-col class="pa-0">
        <div
          v-for="section in Object.keys(notificationSettings)"
          :key="section"
        >
          <h4 class="mt-5 mb-2 capitalize font-weight-bold text-color-primary">
            {{ section }}
          </h4>
          <v-divider></v-divider>
          <template v-for="(option, index) in notificationSettings[section]">
            <v-row :key="option.title" justify="space-between">
              <v-col class="shrink d-flex align-center pr-0">
                <v-icon @click="onInfoClick(option)">info_outline</v-icon>
              </v-col>
              <v-col class="d-flex align-center">
                <span class="body-1 font-weight-light">{{ option.title }}</span>
              </v-col>
              <v-col class="shrink d-flex align-center">
                <v-switch
                  v-model="option.value"
                  class="switch-overwrite"
                  hide-details
                  inset
                  @change="onOptionChange"
                ></v-switch>
              </v-col>
            </v-row>
            <v-divider :key="index"></v-divider>
          </template>
        </div>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import notification_settings from '@/config/notification_settings'
import ProfileInfoDialog from '@/components/dialogs/ProfileInfoDialog'
import SingleSelect from '@/components/profile/SingleSelect'
import { throttle } from 'lodash'
import constants from '@/constants/constants'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

export default {
  name: 'NotificationOptions',
  components: { SingleSelect, ProfileInfoDialog, ContentPane },
  data() {
    return {
      title: 'Instellingen',
      notificationSettings: [],
      selectedMode: null,
      profileOptions: [
        { title: 'Passagier', value: constants.PROFILE_ROLE_PASSENGER },
        { title: 'Passagier + Chauffeur', value: constants.PROFILE_ROLE_BOTH },
        { title: 'Chauffeur', value: constants.PROFILE_ROLE_DRIVER },
      ],
      dialog: {
        isVisible: false,
        content: '',
      },
    }
  },
  computed: {
    notificationOptions() {
      return psStore.getters.getProfile.notificationOptions
    },
    userRole() {
      return psStore.getters.getProfile.userRole
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    if (!this.userRole) {
      this.selectedMode = constants.PROFILE_ROLE_BOTH
    } else {
      this.selectedMode = this.userRole
    }
    this.notificationSettings = { ...notification_settings[this.selectedMode] }
    for (let option of this.notificationSettings.melding) {
      option.value = this.notificationOptions[option.key] || false
    }
  },
  methods: {
    onModeChange: throttle(function(option) {
      this.selectedMode = option.value
      let profile = { ...psStore.getters.getProfile }
      profile.userRole = option.value
      // Check if default have been set, if not do so.
      if (
        (profile.userRole === constants.PROFILE_ROLE_PASSENGER ||
          profile.userRole === constants.PROFILE_ROLE_BOTH) &&
        !profile.searchPreferences
      ) {
        profile.searchPreferences = constants.DEFAULT_PROFILE_SEARCH_PREFERENCES
      }
      if (
        (profile.userRole === constants.PROFILE_ROLE_DRIVER ||
          profile.userRole === constants.PROFILE_ROLE_BOTH) &&
        !profile.ridePlanOptions
      ) {
        profile.ridePlanOptions = constants.DEFAULT_PROFILE_RIDE_PREFERENCES
      }
      psStore.actions.updateProfile(profile)
    }),
    onInfoClick(option) {
      this.dialog.title = option.title
      this.dialog.content = option.info
      this.dialog.isVisible = true
    },
    onOptionChange() {
      const { melding } = this.notificationSettings
      const notificationOptions = {}
      for (const m of melding) {
        notificationOptions[m.key] = m.value
      }
      let profile = { ...psStore.getters.getProfile }
      profile.notificationOptions = notificationOptions
      psStore.actions.updateProfile(profile)
    },
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
