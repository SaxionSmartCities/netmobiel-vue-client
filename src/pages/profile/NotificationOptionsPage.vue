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
          v-for="section in Object.keys(notificationSettings[selectedMode])"
          :key="section"
        >
          <h4 class="mt-4 mb-2 capitalize font-weight-bold text-color-primary">
            {{ section }}
          </h4>
          <v-divider></v-divider>
          <template
            v-for="(option, index) in notificationSettings[selectedMode][
              section
            ]"
          >
            <v-row :key="option.title" justify="space-between">
              <v-col class="shrink d-flex align-center pr-0">
                <v-icon @click="onInfoClick(option)">info_outline</v-icon>
              </v-col>
              <v-col class="d-flex align-center">
                <span>{{ option.title }}</span>
              </v-col>
              <v-col class="shrink d-flex align-center">
                <v-switch
                  class="switch-overwrite"
                  hide-details
                  inset
                  :value="option.value"
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
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

export default {
  name: 'NotificationOptions',
  components: { SingleSelect, ProfileInfoDialog, ContentPane },
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
      dialog: {
        isVisible: false,
        content: '',
      },
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
    onInfoClick(option) {
      this.dialog.title = option.title
      this.dialog.content = option.info
      this.dialog.isVisible = true
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
