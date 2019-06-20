<template>
  <div>
    <v-layout>
      <v-flex>
        <v-parallax :src="'https://cataas.com/cat'" height="300"></v-parallax>
      </v-flex>
    </v-layout>
    <v-container>
      <v-layout column>
        <v-flex xs12>
          <p class="headline mb-0">
            {{ goal().subject }}
          </p>
        </v-flex>
        <v-flex xs12>
          <p class="grey--text">
            {{ goal().location }}
          </p>
        </v-flex>
      </v-layout>
      <v-layout column pt-2>
        <v-flex xs12>
          <p class="text-uppercase text-primary font-weight-bold">
            Hoeveel credits wil je doneren?
          </p>
        </v-flex>
        <v-flex>
          <v-layout justify-center>
            <v-flex xs11>
              <vue-slider
                v-model="selectedAmount"
                :marks="sliderMarks"
                :max="getCredits()"
              ></vue-slider>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout pt-4 column>
        <v-flex>
          <p class="text-uppercase text-primary font-weight-bold">
            Persoonlijk bericht (optioneel)
          </p>
        </v-flex>
        <v-flex>
          <v-textarea
            class="border-radius-input"
            outline
            :placeholder="textAreaPlaceholder"
          >
          </v-textarea>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-switch
            v-model="anonymousDonation"
            class="font-weight-thin"
            :class="{ 'text-primary': anonymousDonation }"
            color="#2E8997"
            :label="labelText"
          ></v-switch>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
  name: 'GoalSupport',
  components: {
    VueSlider,
  },
  data() {
    return {
      selectedAmount: 0,
      anonymousDonation: false,
      textAreaPlaceholder: 'Persoonlijk bericht',
      labelText: 'Maak mijn donatie anoniem',
      sliderMarks: [0, this.getCredits()],
    }
  },
  methods: {
    goal() {
      return this.$store.getters.getGoal(this.$route.params.id)[0]
    },
    getCredits() {
      return this.$store.getters.getCredits
    },
  },
}
</script>

<style lang="scss">
.v-textarea.v-text-field--enclosed textarea {
  margin-top: 12px;
}
.vue-slider-process {
  background-color: $color-primary;
}

.vue-slider:hover .vue-slider-process {
  background-color: $color-primary;
}
</style>
