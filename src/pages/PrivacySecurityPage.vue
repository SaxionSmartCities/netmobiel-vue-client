<template>
  <v-container>
    <v-layout>
      <v-flex mb-3>
        <h3>{{ title }}</h3>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout align-center ma-3 @click="toPrivacyStatement">
      <v-flex xs2>
        <v-icon>lock</v-icon>
      </v-flex>
      <v-flex>
        <p class="mb-0 font-weight-light">Privacy statement</p>
      </v-flex>
      <v-flex xs1>
        <v-icon>chevron_right</v-icon>
      </v-flex>
    </v-layout>
    <v-layout pt-3>
      <v-flex>
        <h2 class="text-primary-uppercase">locatie</h2>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex v-for="option in privacySecurity" :key="option.name">
        <v-divider></v-divider>
        <v-layout align-center mx-3>
          <v-flex>
            <p class="body-1 mb-0">{{ option.name }}</p>
          </v-flex>
          <v-flex xs1>
            <v-switch
              color="#2E8997"
              :input-value="option.value"
              @change="setPrivacyValue(option.name, $event)"
            ></v-switch>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'PrivacySecurity',
  data() {
    return {
      title: 'Privacy & Beveiliging',
    }
  },
  computed: {
    privacySecurity() {
      return this.$store.getters['ps/getUser'].privacySecurity
    },
  },
  created: function() {
    this.$store.commit('showBackButton')
  },
  methods: {
    toPrivacyStatement() {
      this.$router.push({ name: 'privacyStatement' })
    },
    setPrivacyValue(key, state) {
      this.$store.commit('ps/setPrivacySecurityValue', {
        key: key,
        value: state,
      })
    },
  },
}
</script>
