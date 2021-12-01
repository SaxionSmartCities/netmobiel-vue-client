<template>
  <v-card class="rounded-border">
    <v-card-title>Geef je woonadres op</v-card-title>
    <v-card-text class="py-0">
      <v-row>
        <v-col
          >Je woonadres wordt gebruikt bij het plannen en/of zoeken van ritten.
          Je kunt het later altijd wijzigen. Type minimaal 3 karakters in om
          suggesties te krijgen.</v-col
        >
      </v-row>
      <v-row>
        <v-col>
          <search-location
            :address="value.address"
            field="home"
            :favorable="false"
            :outlined="true"
            label="Mijn adres"
            @search-completed="onSearchCompleted"
          ></search-location>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row no-gutters class="mb-2">
        <v-col xs6 class="mx-2">
          <v-btn block rounded outlined color="primary" @click="back()">
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
  mounted() {
    this.valid = this.isValidAddress()
  },
  methods: {
    isValidAddress() {
      return this.value.address.location?.coordinates?.length === 2
    },
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
      this.valid = this.isValidAddress()
    },
  },
}
</script>

<style scoped lang="scss"></style>
