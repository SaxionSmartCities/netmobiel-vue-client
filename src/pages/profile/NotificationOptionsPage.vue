<template>
  <v-container>
    <v-layout column>
      <v-flex mb-3>
        <h1>{{ title }}</h1>
      </v-flex>
      <v-flex mb-2>
        <v-divider />
      </v-flex>
    </v-layout>
    <v-layout pt-3>
      <v-flex>
        <h3 class="text-primary-uppercase">Reizen</h3>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex v-for="option in tripOptions" :key="option.name">
        <v-divider></v-divider>
        <v-layout align-center mr-3>
          <v-flex>
            <p class="body-1 mb-0">{{ option.name }}</p>
          </v-flex>
          <v-flex xs1>
            <v-switch
              :input-value="option.value"
              color="#2E8997"
              @change="setTripValue(option.name, $event)"
            ></v-switch>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout v-if="isDriver" pt-3>
      <v-flex>
        <p class="text-primary-uppercase">Auto's</p>
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex>
        <car-options v-if="isDriver"></car-options>
      </v-flex>
    </v-layout>
    <v-layout pt-3>
      <v-flex>
        <h3 class="text-primary-uppercase">Notificaties</h3>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex v-for="option in notificationOptions" :key="option.name">
        <v-divider></v-divider>
        <v-layout align-center mr-3>
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
        <h2 class="text-primary-uppercase">Reviews</h2>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex v-for="option in reviewOptions" :key="option.name">
        <v-divider></v-divider>
        <v-layout align-center mr-3>
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
import CarOptions from '@/components/settings/CarOptions.vue'

export default {
  name: 'NotificationOptions',
  components: {
    CarOptions,
  },
  data() {
    return {
      title: 'Instellingen',
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
<style scoped>
.v-input__control {
  height: 32px !important;
}
</style>