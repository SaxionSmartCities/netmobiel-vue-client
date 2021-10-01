<template>
  <v-card class="rounded-border">
    <v-card-title><h3>Even voorstellen!</h3></v-card-title>
    <v-card-text class="py-0">
      <v-row no-gutters>
        <v-col>
          <span class="text-uppercase text-color-primary ">
            Wat is je geboortedatum?
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <date-menu-selector
            :value="dateOfBirth"
            label="Geboortedatum"
            :outlined="true"
            @date-selected="onUpdateDate"
          ></date-menu-selector>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col xs6 class="mx-2">
          <v-btn block rounded outlined color="primary" @click="prevStep()">
            Terug
          </v-btn>
        </v-col>
        <v-col xs6 class="mx-2">
          <v-btn block rounded depressed color="button" @click="nextStep()">
            Verder
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as psStore from '@/store/profile-service'
import DateMenuSelector from '@/components/common/DateMenuSelector'

export default {
  name: 'AgeCard',
  components: { DateMenuSelector },
  data: function() {
    return {
      dateOfBirth: null,
      menu: false,
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
  },
  mounted() {
    this.dateOfBirth = this.profile.dateOfBirth
  },
  methods: {
    onUpdateDate(date) {
      this.dateOfBirth = date
    },
    nextStep() {
      let profile = { ...psStore.getters.getProfile }
      profile.dateOfBirth = this.dateOfBirth
      psStore.actions.updateProfile(profile)
      this.$emit('next-step')
    },
    prevStep() {
      this.$emit('prev-step')
    },
  },
}
</script>

<style lang="scss"></style>
