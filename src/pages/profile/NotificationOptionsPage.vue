<template>
  <content-pane>
    <v-row>
      <v-col class="pa-0 ">
        <h1 class="headline">Instellingen</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 ">
        <h2
          class="mt-4 text-uppercase caption font-weight-bold text-color-primary"
        >
          Gebruik netmobiel als
        </h2>
        <single-select :options="profileOptions"></single-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 ">
        <div
          v-for="section in Object.keys(notificationSettings)"
          :key="section"
        >
          <span
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            {{ section }}
          </span>
          <v-divider></v-divider>
          <template v-for="(option, index) in notificationSettings[section]">
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
              v-if="index !== notificationSettings[section].length - 1"
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

export default {
  name: 'NotificationOptions',
  components: { SingleSelect, ContentPane },
  data() {
    return {
      title: 'Instellingen',
      notificationSettings: notification_settings,
      profileOptions: [
        { title: 'Reiziger', value: 'traveller' },
        { title: 'Chauffeur', value: 'driver' },
        { title: 'Reiziger+Chauffeur', value: 'both' },
      ],
    }
  },
  computed: {
    notificationOptions() {
      return this.$store.getters['ps/getUser'].notificationOptions
    },
    tripOptions() {
      return this.$store.getters['ps/getUser'].tripOptions
    },
    isDriver() {
      return this.$store.getters['ps/getUser'].tripOptions[0].value
    },
    reviewOptions() {
      return this.$store.getters['ps/getUser'].reviews
    },
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    setNotificationValue(key, state) {
      this.$store.commit('ps/setNotificationOptionsValue', {
        key: key,
        value: state,
      })
    },
    setTripValue(key, state) {
      this.$store.commit('ps/setTripOptionsValue', {
        key: key,
        value: state,
      })
    },
    setReviewValue(key, state) {
      this.$store.commit('ps/setReviewOptionsValue', {
        key: key,
        value: state,
      })
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
