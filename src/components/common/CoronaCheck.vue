<template>
  <div class="main-container">
    <div class="text--white">
      <v-btn
        small
        :color="buttonColor()"
        depressed
        rounded
        @click="showModel = !showModel"
      >
        Corona check
      </v-btn>
    </div>
    <v-dialog v-model="showModel" max-width="400px">
      <v-card>
        <v-card-title class="headline">
          Corona check
        </v-card-title>

        <v-card-text class="mt-2">
          <v-checkbox
            v-model="houseHoldHadCorona"
            label="De afgelopen 14 dagen is er bij mij en bij niemand in mijn huishouden corona vastgesteld"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="coronaSymptoms"
            label="Ik ben vrij van coronaklachten: koorts, hoesten, verkoudheid of benauwdheid"
            hide-details
          ></v-checkbox>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" @click="done()">
            klaar
          </v-btn>
          <v-btn color="primary-btn" text @click="showModel = false">
            sluit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'CoronaCheck',
  data() {
    return {
      showModel: false,
      coronaSymptoms: false,
      houseHoldHadCorona: false,
    }
  },
  methods: {
    done() {
      this.$emit('done', {
        coronaSymptoms: this.coronaSymptoms,
        houseHoldHadCorona: this.houseHoldHadCorona,
      })
      this.showModel = false
    },
    buttonColor() {
      if (this.coronaSymptoms && this.houseHoldHadCorona) return 'green'
      else return 'red'
    },
  },
}
</script>

<style lang="scss" scoped>
.main-container {
}
</style>
