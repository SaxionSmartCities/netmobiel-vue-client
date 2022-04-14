<template>
  <content-pane>
    <v-row dense>
      <v-col>
        <h1>Instellingen</h1>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <h4 class="font-weight-bold text-color-primary">
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
    <v-row dense>
      <profile-info-dialog
        :show-dialog="dialogIsVisible"
        :dialog="dialog"
        @close="dialogIsVisible = false"
      />
      <v-col>
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
              <v-col class="shrink">
                <v-icon @click="onInfoClick(option)">info_outline</v-icon>
              </v-col>
              <v-col>
                <span class="body-1 font-weight-light">{{ option.title }}</span>
              </v-col>
              <v-col class="shrink d-flex flex-column">
                <v-switch
                  v-model="option.value"
                  :disabled="!option.supported"
                  class="switch-padding"
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
      dialogIsVisible: false,
      dialog: {
        title: '',
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
    onModeChange: throttle(function (option) {
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
      psStore.actions
        .updateMyProfile(profile)
        .then(() => psStore.actions.fetchMyProfile())
    }),
    onInfoClick(option) {
      this.dialog.title = option.title
      this.dialog.content = option.info
      this.dialogIsVisible = true
    },
    onOptionChange() {
      const { melding } = this.notificationSettings
      const notificationOptions = {}
      for (const m of melding) {
        notificationOptions[m.key] = m.value
      }
      let profile = { ...psStore.getters.getProfile }
      profile.notificationOptions = notificationOptions
      psStore.actions
        .updateMyProfile(profile)
        .then(() => psStore.actions.fetchMyProfile())
    },
  },
}
</script>
<style lang="scss" scoped>
.switch-padding {
  padding-top: 8px;
  padding-bottom: 8px;
  margin-top: 0;
}
.v-input__control {
  height: 32px !important;
}
</style>
