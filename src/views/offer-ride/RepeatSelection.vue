<template
  ><v-container>
    <v-layout column>
      <v-flex mb-4>
        <h1>Herhalen</h1>
      </v-flex>
      <v-flex> <v-divider></v-divider> </v-flex>
      <v-flex>
        <v-radio-group v-model="radioGroup">
          <v-radio
            v-for="n in 8"
            :key="n"
            :label="`Radio ${n}`"
            :value="n"
          ></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout> </v-container
></template>

<script>
export default {
  name: 'RepeatSelection',
  data: function() {
    return {
      radioGroup: 1,
    }
  },
}
</script>

<style scoped></style>
