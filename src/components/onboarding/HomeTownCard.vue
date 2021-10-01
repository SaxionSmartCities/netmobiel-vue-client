<template>
  <v-card class="rounded-border">
    <v-card-title>Uw Woonadres</v-card-title>
    <v-card-text class="py-0">
      <v-row>
        <v-col
          >Uw woonadres wordt gebruikt bij het plannen. U kunt het later altijd
          wijzigen. Voer minimaal 3 karakters in om adressuggesties te
          krijgen.</v-col
        >
      </v-row>
      <v-row>
        <v-col>
          <search-location
            field="home"
            :favorable="false"
            :outlined="true"
            label="Adres"
            @search-completed="onSearchCompleted"
          ></search-location>
        </v-col>
      </v-row>
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
import SearchLocation from '@/components/search/SearchLocation'
export default {
  name: 'HomeTownCard',
  components: { SearchLocation },
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      valid: false,
      showSubmitButton: true,
    }
  },
  computed: {
    stateOrCountryCode() {
      let code
      if (this.value?.address) {
        code =
          this.value.address?.countryCode === 'NLD'
            ? this.value.address.stateCode
            : this.value.address.countryCode
      }
      return code ? `(${code})` : ''
    },
  },
  methods: {
    submitForm() {
      if (this.valid) {
        this.$emit('next-step')
      }
    },
    back() {
      this.$emit('prev-step')
    },
    onSearchCompleted(place) {
      if (place?.locality) {
        this.value.address = { ...place }
      } else {
        this.value.address = {}
      }
      this.valid = this.value.address.location?.coordinates?.length === 2
    },
  },
}
</script>

<style scoped lang="scss"></style>
