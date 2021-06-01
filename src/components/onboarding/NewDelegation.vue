<template>
  <v-form ref="form" v-model="valid">
    <v-row no-gutters>
      <v-col dense>
        <v-row>
          <v-col>
            <v-text-field
              :rules="[rules.required]"
              required
              hide-details
              outlined
              label="Voornaam"
              :value="value.firstName"
              @input="editFirstName"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              required
              hide-details
              outlined
              label="Achternaam"
              :rules="[rules.required]"
              :value="value.lastName"
              @input="editLastName"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              required
              hide-details
              outlined
              label="Mobiel nummer"
              :rules="[rules.required, rules.phone]"
              :value="value.phoneNumber"
              @input="editPhoneNumber"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              required
              hide-details
              outlined
              label="E-mail"
              :value="value.email"
              @input="editEmail"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters align="center">
          <v-col cols="1">
            <v-checkbox
              required
              :rules="[rules.required]"
              :input-value="value.consent.acceptedTerms"
              @change="onChangeConsent"
            ></v-checkbox>
          </v-col>
          <v-col cols="11">
            Ik ga akkoord met de <a to="/">voorwaarden</a>, deelname aan het
            <a to="/">onderzoek</a> en het <a to="/">privacystatement</a>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col text-xs-center>
            <v-alert
              v-if="showConsentError"
              :value="true"
              type="error"
              color="red"
            >
              U moet akkoord gaan met de voorwaarden om verder te gaan.
            </v-alert>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  name: 'NewDelegation',
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      enableConsentCheck: false,
      showSubmitButton: true,
      valid: false,
      rules: {
        required: value => !!value || '',
        phone: value => /^\d{10}$/.test(value) || '',
      },
    }
  },
  computed: {
    showConsentError() {
      return (
        (!this.value.consent.acceptedTerms ||
          !this.value.consent.olderThanSixteen) &&
        this.enableConsentCheck
      )
    },
  },
  mounted() {
    this.validate()
  },
  methods: {
    editFirstName(newValue) {
      this.value.firstName = newValue
      this.validate()
    },
    editLastName(newValue) {
      this.value.lastName = newValue
      this.validate()
    },
    editPhoneNumber(newValue) {
      this.value.phoneNumber = newValue
      this.validate()
    },
    editEmail(newValue) {
      this.value.email = newValue
      this.validate()
    },
    onChangeConsent(checked) {
      this.value.consent.acceptedTerms = checked
      this.validate()
    },
    validate() {
      this.$nextTick(() => {
        const isValid = this.$refs.form.validate()
        this.$emit('onFormValid', isValid)
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
