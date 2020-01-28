<template>
  <v-card class="rounded-border">
    <v-card-title>Even voorstellen!</v-card-title>
    <v-card-text class="py-0">
      <v-row no-gutters>
        <v-col>
          <p>
            Laat weten wie je bent, zodat reizigers of chauffeurs vertrouwen in
            jou krijgen.
          </p>
          <span class="text-uppercase text-color-primary ">
            Wat zijn je interesses?
          </span>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-chip-group v-model="selectedInterests" multiple column>
            <v-chip
              v-for="interest in interestsList"
              :key="interest.interest"
              :value="interest.interest"
              active-class="selectedInterest"
            >
              {{ interest.label }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col xs6 class="mx-2">
          <v-btn block rounded outlined @click="skipStep()">Overslaan</v-btn>
        </v-col>
        <v-col xs6 class="mx-2">
          <v-btn block rounded color="button" @click="nextStep()">Verder</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment'
import interests from '@/constants/interests.js'

export default {
  data: function() {
    return {
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      selectedInterests: [],
    }
  },
  computed: {
    displayDate: function() {
      return moment(this.date).format('DD-MM-YYYY')
    },
    interestsList: function() {
      return interests
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  methods: {
    skipStep: function() {
      this.$emit('next-step')
    },
    nextStep: function() {
      let profile = { ...this.$store.getters['ps/getProfile'] }
      profile.interests = this.selectedInterests
      this.$store.dispatch('ps/updateProfile', profile)
      this.$emit('next-step')
    },
  },
}
</script>

<style lang="scss">
.selectedInterest {
  background: #8bb7be;
}
</style>
