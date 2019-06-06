<template>
  <v-layout column travel-card ma-2>
    <v-flex>
      <v-layout row align-center>
        <v-flex xs4 ma-4>
          <v-img aspect-ratio="1" :src="itemObj.image"></v-img>
        </v-flex>
        <v-flex>
          <v-layout column align-end>
            <v-flex pr-4>
              <h3>{{ itemObj.name }}</h3>
              <p>{{ itemObj.address }}</p>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout>
        <v-flex mx-5>
          <v-progress-linear
            :value="calculateProgress()"
            color="green"
          ></v-progress-linear>
        </v-flex>
      </v-layout>
      <v-layout align-center column>
        <v-flex>
          <v-subheader
            >Nog
            {{ itemObj.goalCredits - itemObj.currentCredits }}
            credits</v-subheader
          >
        </v-flex>
        <v-flex mb-2>
          <v-btn round>Doel steunen</v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'GoalIteam',
  props: ['item'],
  data: function() {
    return {
      itemObj: this.item,
    }
  },
  methods: {
    calculateProgress: function() {
      return (this.itemObj.currentCredits / this.itemObj.goalCredits) * 100
    },
  },
}
</script>

<style scoped></style>
