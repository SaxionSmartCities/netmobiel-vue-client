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
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                hide-details
                dense
                :value="displayDate"
                prepend-icon="event"
                readonly
                v-on="on"
              >
              </v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="date"
              :max="new Date().toISOString().substr(0, 10)"
              min="1900-01-01"
            ></v-date-picker>
          </v-menu>
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
import moment from 'moment'
import '@js-joda/timezone'
import { Locale } from '@js-joda/locale_en'
import * as psStore from '@/store/profile-service'
import { DateTimeFormatter, LocalDate } from '@js-joda/core'

export default {
  data: function() {
    return {
      date: LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE),
      menu: false,
    }
  },
  computed: {
    displayDate: function() {
      const formatter = DateTimeFormatter.ofPattern('dd-MM-yyyy').withLocale(
        Locale.ENGLISH
      )
      return LocalDate.parse(this.date).format(formatter)
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  methods: {
    nextStep: function() {
      let profile = { ...psStore.getters.getProfile }
      profile.dateOfBirth = LocalDate.parse(this.date)
      psStore.actions.updateProfile(profile)
      this.$emit('next-step')
    },
    prevStep: function() {
      this.$emit('prev-step')
    },
  },
}
</script>

<style lang="scss"></style>
