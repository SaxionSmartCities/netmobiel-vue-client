<template>
  <v-container>
    <v-layout>
      <p class="headline font-weight-medium">{{ title }}</p>
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
        <p class="body-1 text-primary font-weight-medium">LOCATIE</p>
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
      return this.$store.getters.getPrivacySecurity
    },
  },
  methods: {
    toPrivacyStatement() {
      this.$router.push('/privacyStatement')
    },
    setPrivacyValue(key, state) {
      this.$store.commit('setPrivacySecurityValue', { key: key, value: state })
    },
  },
}
</script>

<style scoped></style>
