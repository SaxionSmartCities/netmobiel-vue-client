<template>
  <v-card class="rounded-border">
    <v-card-title>Even voorstellen!</v-card-title>
    <v-card-text class="py-0">
      <v-row no-gutters align="center">
        <v-col cols="1">
          <v-checkbox v-model="driver"></v-checkbox>
        </v-col>
        <v-col cols="11">
          Ik wil ritten aanbieden
        </v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col cols="1">
          <v-checkbox v-model="passenger"></v-checkbox>
        </v-col>
        <v-col cols="11">
          Ik wil graag meerijden met andere bestuurders.
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row no-gutters>
        <v-col xs6 class="mx-2">
          <v-btn block rounded color="button" @click="submitForm()"
            >Verder</v-btn
          >
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'HomeTownCard',
  data: function() {
    return {
      driver: false,
      passenger: false,
      showSubmitButton: true,
    }
  },
  computed: {
    getRegistrationStatus() {
      return this.$store.getters['rs/getRegistrationStatus']
    },
  },
  watch: {
    getRegistrationStatus(newValue) {
      if (newValue.success === true) {
        this.showSubmitButton = false

        this.waiting = setTimeout(() => {
          //   this.$store.commit('rs/clearRegistrationRequest')
          this.$emit('next-step')
        }, 2500)
      }
    },
  },
  beforeCreate() {
    this.$store.commit('ui/disableFooter')
  },
  methods: {
    submitForm: function() {
      if (this.agreedAll && this.ageCheck) {
        this.$store.dispatch(
          'rs/submitRegistrationRequest',
          this.registrationRequest
        )
      } else {
        this.acceptError.success = false
        this.acceptError.message =
          'U moet zowel akkoord gaan met de voorwaarden alsmede 16 jaar of ouder zijn.'
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
