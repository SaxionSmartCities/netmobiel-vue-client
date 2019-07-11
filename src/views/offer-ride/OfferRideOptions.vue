<template>
  <v-container class="background-green">
    <v-layout justify-center align-center column>
      <v-flex xs11 sm9 md6>
        <v-layout column shrink>
          <v-flex class="box-widget background-white">
            <v-form>
              <v-layout>
                <v-flex xs12 ma-2>
                  <h1 class="subheading">{{ title[step - 1] }}</h1>
                </v-flex>
              </v-layout>

              <v-layout v-if="step === 1" justify-center align-center ma-5>
                <v-flex shrink>
                  <v-btn
                    id="buttonMinus"
                    small
                    flat=""
                    fab
                    class="blue-white-button"
                    @click="incrementPersons(-1)"
                    >-</v-btn
                  >
                </v-flex>
                <v-flex xs3 md1 lg1 xl1 class="mt-2">
                  <v-text-field
                    id="inputPersons"
                    v-model="personen"
                    readonly
                    class="font-weight-bold"
                    type="number"
                    max="10"
                    read-only
                    value="1"
                  ></v-text-field>
                </v-flex>
                <v-flex shrink>
                  <v-btn
                    id="buttonPlus"
                    small
                    flat
                    fab
                    class="blue-white-button"
                    @click="incrementPersons(1)"
                    >+</v-btn
                  >
                </v-flex>
              </v-layout>

              <v-layout column ma-1 v-if="step === 2">
                <v-flex
                  v-for="luggage in luggageList"
                  :key="luggage"
                  :label="luggage"
                >
                  <v-checkbox
                    v-model="luggageChoice"
                    class="checkboxDaySelect"
                    :label="luggage"
                    :value="luggage"
                    id="checkbox"
                    @change="checkboxLuggageOnClick"
                  ></v-checkbox>
                </v-flex>
              </v-layout>

              <v-layout v-if="step === 3" justify-center align-center ma-1>
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

              <v-layout v-if="step === 4" justify-center align-center my-1>
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
                <v-flex shrink @click="goStepBack()">
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
  name: 'OfferRideOptions',
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
      luggageChoice: [],
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
    checkboxLuggageOnClick: function() {
      let result = ''
      for (let i = 0; i < this.luggageChoice.length; i++) {
        result += this.luggageChoice[i]
        if (i !== this.luggageChoice.length - 1) {
          result += ', '
        }
      }
      this.$store.commit('setRideOfferPreferencesRepeat', { luggage: result })
    },
  },
}
</script>

<style lang="scss">
#inputPersons {
  text-align: center;
}

.round label {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  height: 28px;
  left: 0;
  position: absolute;
  top: 0;
  width: 28px;
}

.round label:after {
  border: 2px solid #fff;
  border-top: none;
  border-right: none;
  content: '';
  height: 6px;
  left: 7px;
  opacity: 0;
  position: absolute;
  top: 8px;
  transform: rotate(-45deg);
  width: 12px;
}

.round input[type='checkbox'] {
  visibility: hidden;
}

.round input[type='checkbox']:checked + label {
  background-color: $color-green;
  border-color: $color-green;
}

.round input[type='checkbox']:checked + label:after {
  opacity: 1;
}

body {
  background-color: #f1f2f3;
}
</style>
