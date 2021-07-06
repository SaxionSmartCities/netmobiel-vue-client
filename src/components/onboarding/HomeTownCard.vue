<template>
  <v-card class="rounded-border">
    <v-card-title>Voer je thuis adres in</v-card-title>
    <v-card-text class="py-0">
      <v-form ref="form" v-model="valid">
        <v-row vertical-align-center no-gutters>
          <v-col dense>
            <v-text-field
              v-model="value.address.street"
              label="Straat"
              maxlength="250"
              outlined
              :rules="[rules.required]"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row vertical-align-center no-gutters>
          <v-col dense cols="5">
            <v-text-field
              v-model="value.address.houseNumber"
              label="Huisnummer"
              maxlength="25"
              outlined
              :rules="[rules.required]"
            >
            </v-text-field>
          </v-col>
          <v-col dense cols="1"></v-col>
          <v-col dense cols="6">
            <v-text-field
              v-model="value.address.postalCode"
              label="Postcode"
              maxlength="6"
              outlined
              :rules="[rules.required, rules.postalcode]"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row vertical-align-center no-gutters>
          <v-col dense>
            <v-text-field
              v-model="value.address.locality"
              label="Woonplaats"
              maxlength="250"
              outlined
              :rules="[rules.required]"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-row no-gutters class="mb-2">
        <v-col xs6 class="mx-2">
          <v-btn block text @click="back()">
            <v-icon>arrow_back</v-icon>
            Terug
          </v-btn>
        </v-col>
        <v-col xs6 class="mx-2">
          <v-btn
            block
            rounded
            depressed
            color="button"
            :disabled="!valid"
            @click="submitForm()"
          >
            Verder
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'HomeTownCard',
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      rules: {
        required: value => !!value || '',
        postalcode: value =>
          !!(value && value.match(/^([0-9]{4}[a-zA-Z]{2})$/)) ||
          'Ongeldige postcode',
      },
      valid: false,
      showSubmitButton: true,
    }
  },
  methods: {
    validate() {
      this.$nextTick(() => {
        const isValid = this.$refs.form.validate()
        this.$emit('onFormValid', isValid)
      })
    },
    submitForm() {
      this.value.address.countryCode = 'NL'
      this.validate()
      if (this.valid) {
        this.$emit('next-step')
      }
    },
    back() {
      this.$emit('prev-step')
    },
  },
}
</script>

<style scoped lang="scss"></style>
