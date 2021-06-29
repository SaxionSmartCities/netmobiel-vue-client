<template>
  <v-card class="rounded-border">
    <v-card-title>Hoe ga je netmobiel gebruiken?</v-card-title>
    <v-card-text class="py-0">
      <v-radio-group v-model="value.userRole" :mandatory="false">
        <v-radio label="Meerijden of via het OV" value="passenger"></v-radio>
        <v-radio label="Zelf ritten aanbieden" value="driver"></v-radio>
        <v-radio label="Meerijden én zelf ritten aanbieden" value="both">
        </v-radio>
      </v-radio-group>
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
            :disabled="!value.userRole"
            @click="submitForm()"
          >
            Aanmaken
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
      showSubmitButton: true,
    }
  },
  methods: {
    submitForm() {
      this.$emit('next-step')
    },
    back() {
      this.$emit('prev-step')
    },
  },
}
</script>

<style scoped lang="scss"></style>
