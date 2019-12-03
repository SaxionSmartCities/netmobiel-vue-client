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
      <v-row no-gutters class="mb-2">
        <v-col xs6 class="mx-2">
          <v-btn block text @click="back()">
            <v-icon>arrow_back</v-icon>
            Terug
          </v-btn>
        </v-col>
        <v-col xs6 class="mx-2">
          <v-btn block rounded color="button" @click="submitForm()">
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
  data() {
    return {
      items: [
        'Groenlo',
        'Harreveld',
        'Lievelde',
        'Lichtenvoorde',
        'Mariënvelde',
        'Vragender',
        'Zieuwent',
        'Zwolle',
      ],
      showSubmitButton: true,
    }
  },
  beforeCreate() {
    this.$store.commit('ui/disableFooter')
  },
  methods: {
    submitForm: function() {
      this.$emit('next-step')
    },
    back: function() {
      this.$emit('prev-step')
    },
  },
}
</script>

<style scoped lang="scss"></style>
