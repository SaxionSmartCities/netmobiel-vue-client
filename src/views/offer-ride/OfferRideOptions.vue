<template>
  <v-container class="background-green">
    <v-layout justify-center align-center v-model="step">
      <v-flex xs11 sm9 md6>
        <v-layout column shrink>
          <v-flex class="box-widget background-white">
            <v-form>
              <v-layout>
                <v-flex xs12 ma-2>
                  <h1 class="subheading">{{ title[step - 1] }}</h1>
                </v-flex>
              </v-layout>

              <v-layout justify-center align-center ma-5 v-if="step === 1">
                <v-flex shrink>
                  <v-btn
                    small
                    flat=""
                    fab
                    @click="incrementPersons(-1)"
                    id="buttonMinus"
                    class="blue-white-button"
                    >-</v-btn
                  >
                </v-flex>
                <v-flex xs3 md1 lg1 xl1 class="mt-2">
                  <v-text-field
                    readonly
                    class="font-weight-bold"
                    id="inputPersons"
                    v-model="personen"
                    type="number"
                    max="10"
                    read-only
                    value="1"
                  ></v-text-field>
                </v-flex>
                <v-flex shrink>
                  <v-btn
                    small
                    flat
                    fab
                    @click="incrementPersons(1)"
                    id="buttonPlus"
                    class="blue-white-button"
                    >+</v-btn
                  >
                </v-flex>
              </v-layout>

              <v-layout justify-center align-center ma-1 v-if="step === 2">
                <v-radio-group v-model="radioGroup">
                  <v-radio
                    v-for="luggage in luggageList"
                    :key="luggage"
                    :label="luggage"
                    :value="luggage"
                  ></v-radio>
                </v-radio-group>
              </v-layout>

              <v-layout justify-center align-center ma-1 v-if="step === 3">
                <v-radio-group v-model="radioGroup">
                  <v-radio
                    v-for="drive in timeDriveList"
                    :key="drive"
                    :label="drive"
                    :value="drive"
                    @change="radioChangeDriveTime(drive)"
                  ></v-radio>
                </v-radio-group>
              </v-layout>

              <v-layout justify-center align-center my-1 v-if="step === 4">
                <v-flex>
                  <v-layout row>
                    <v-flex xs5 sm2>
                      <v-subheader class="font-weight-bold">
                        Kenteken
                      </v-subheader>
                    </v-flex>
                    <v-flex>
                      <v-text-field
                        class="pb-0 pt-1 body-2"
                        placeholder="Geef uw kenteken op"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>

              <v-layout
                align-center
                justify-space-between
                row
                fill-height
                class="ma-2"
              >
                <v-flex shrink v-on:click="goStepBack()">
                  <v-layout row>
                    <v-flex>
                      <v-icon class="icon-grey">arrow_back</v-icon>
                    </v-flex>
                    <v-flex>
                      <p
                        class="mb-0 text-optionsGrey font-weight-bold subheading"
                      >
                        Terug
                      </p>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex shrink>
                  <v-btn
                    class="orange-white-button"
                    round
                    @click="setNextStep()"
                    >{{ buttonText }}</v-btn
                  >
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'offerRideOptions',
  data() {
    return {
      title: [
        'Hoeveel kunnen er mee?',
        'Wat kan er allemaal mee?',
        'Wil je eventueel omrijden?',
        'Hoe ziet uw auto eruit?',
      ],
      personen: 1,
      step: 1,
      buttonText: 'Verder',
      radioGroup: 1,
      luggageList: [
        'Geen bagage',
        'Boodschappen',
        'Handbagage',
        'Buggy',
        'Rollator',
        'Huisdier',
      ],
      timeDriveList: [
        'Nee, ik rijd niet om.',
        'Ja, maximaal 5 minuten.',
        'Ja, maximaal 10 minuten.',
        'Ja, maximaal 20 minuten.',
      ],
    }
  },
  methods: {
    incrementPersons(i) {
      if (i === 1 && this.personen < 8) {
        this.personen = this.personen + i
      } else if (i === -1 && this.personen > 1)
        this.personen = this.personen + i
    },
    goStepBack() {
      if (this.step !== 1) {
        this.step--
        this.buttonText = 'Volgende'
      } else {
        this.$router.push({ name: 'offerPage' })
      }
    },
    setData() {

      if (this.step === 1) {
        this.$store.commit('setRideOfferPreferencesRepeat', {
          persons: this.personen,
        })
      }
    },
    setNextStep() {
      this.setData()
      if (this.step !== 4) {
        this.step++
        if (this.step === 4) {
          this.buttonText = 'Rit bevestigen'
        }
      }
    },
    radioChangeDriveTime: function(drive) {
      this.$store.commit('setRideOfferPreferencesRepeat', {
        drivingTime: drive,
      })
    },
  },
}
</script>

<style lang="scss">
#inputPersons {
  text-align: center;
}
</style>
