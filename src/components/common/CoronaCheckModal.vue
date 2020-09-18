<template>
  <div class="main-container">
    <v-dialog v-model="value.isVisible" max-width="400px">
      <v-card>
        <v-card-title class="headline mb-0">
          Corona check
        </v-card-title>

        <v-card-text>
          <v-checkbox
            v-model="value.coronaFreePast"
            label="De afgelopen 14 dagen is er bij mij en bij niemand in mijn huishouden corona vastgesteld."
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="value.coronaFreeHousehold"
            label="Ik ben vrij van coronaklachten: koorts, hoesten, verkoudheid of benauwdheid."
            hide-details
          ></v-checkbox>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            rounded
            block
            depressed
            color="button"
            class="mb-2"
            @click="done()"
          >
            Opslaan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'CoronaCheckModal',
  props: {
    value: { type: Object, default: () => undefined },
  },
  methods: {
    done() {
      this.$emit('done', {
        coronaFreePast: this.value.coronaFreePast,
        coronaFreeHousehold: this.value.coronaFreeHousehold,
      })
      this.value.isVisible = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
