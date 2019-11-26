<template>
  <v-card class="rounded-border">
    <v-card-title>Maak een account aan</v-card-title>
    <v-card-text class="py-0">
      <v-row vertical-align-center>
        <v-col class="d-flex" cols="12" sm="6">
          <v-select :items="items" label="Woonplaats" outlined></v-select>
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
      items: ['Goor', 'Enschede', 'Haaksbergen', 'Zieuwent'],
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
