<template>
  <v-container>
    <v-layout>
      <p class="headline font-weight-medium">{{ title }}</p>
    </v-layout>

    <v-layout pt-3>
      <v-flex>
        <p class="text-primary-uppercase">Profiel</p>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex v-for="option in profileOptions" :key="option.name">
        <v-divider></v-divider>
        <v-layout align-center mx-3>
          <v-flex>
            <p class="body-1 mb-0">{{ option.name }}</p>
          </v-flex>
          <v-flex xs1>
            <v-switch
              :input-value="option.value"
              color="#2E8997"
              @change="setProfileValue(option.name, $event)"
            ></v-switch>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout pt-3>
      <v-flex>
        <p class="text-primary-uppercase">Notificaties</p>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex v-for="option in notificationOptions" :key="option.name">
        <v-divider></v-divider>
        <v-layout align-center mx-3>
          <v-flex>
            <p class="body-1 mb-0">{{ option.name }}</p>
          </v-flex>
          <v-flex xs1>
            <v-switch
              :input-value="option.value"
              color="#2E8997"
              @change="setNotificationValue(option.name, $event)"
            ></v-switch>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout pt-3>
      <v-flex>
        <p class="text-primary-uppercase">Reviews</p>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex v-for="option in reviewOptions" :key="option.name">
        <v-divider></v-divider>
        <v-layout align-center mx-3>
          <v-flex>
            <p class="body-1 mb-0">{{ option.name }}</p>
          </v-flex>
          <v-flex xs1>
            <v-switch
              :input-value="option.value"
              color="#2E8997"
              @change="setReviewValue(option.name, $event)"
            ></v-switch>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'NotificationOptions',
  data() {
    return {
      title: 'Instellingen',
    }
  },
  computed: {
    notificationOptions() {
      return this.$store.getters.getNotificationOptions
    },
    profileOptions() {
      return this.$store.getters.getNotifcationProfileOptions
    },
    reviewOptions() {
      return this.$store.getters.getReviewsOptions
    },
  },
  methods: {
    setNotificationValue(key, state) {
      this.$store.commit('setNotificationOptionsValue', {
        key: key,
        value: state,
      })
    },
    setProfileValue(key, state) {
      this.$store.commit('setProfileOptionsValue', {
        key: key,
        value: state,
      })
    },
    setReviewValue(key, state) {
      this.$store.commit('setReviewOptionsValue', {
        key: key,
        value: state,
      })
    },
  },
}
</script>

<style lang="scss"></style>
