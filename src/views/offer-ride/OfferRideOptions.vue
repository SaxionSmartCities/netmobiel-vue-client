<template>
  <v-container class="background-green" fluid>
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

              <v-layout v-if="step === 2" column ma-1>
                <v-flex
                  v-for="luggage in luggageList"
                  :key="luggage"
                  :label="luggage"
                >
                  <v-checkbox
                    id="checkbox"
                    v-model="luggageChoice"
                    class="checkboxDaySelect"
                    :label="luggage"
                    :value="luggage"
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
                    <v-flex>
                      <v-subheader class="font-weight-bold">
                        Kenteken
                      </v-subheader>
                    </v-flex>
                    <v-flex>
                      <v-form ref="form">
                        <v-text-field
                          v-model="kenteken"
                          :rules="licenseRules"
                          class="pb-0 pt-1 body-2"
                          placeholder="Geef uw kenteken op"
                        ></v-text-field>
                      </v-form>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>

              <v-layout v-if="step > 4" justify-center align-center my-1>
                <v-flex>
                  <v-layout column>
                    <v-flex>
                      <v-text-field
                        :value="this.$store.getters.getCarInfo.brand"
                        readonly
                        label="Merk "
                        class="pb-0 pt-1 body-2"
                      ></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field
                        :value="this.$store.getters.getCarInfo.model"
                        readonly
                        label="Model "
                        class="pb-0 pt-1 body-2"
                      ></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field
                        :value="this.$store.getters.getCarInfo.color"
                        readonly
                        label="Kleur"
                        class="pb-0 pt-1 body-2"
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
                <v-flex shrink @click="goStepBack()" mr-3>
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
                    :disabled="!setDisabled()"
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
        'Wat is uw kenteken?',
        'Kloppen uw gegevens?',
      ],
      personen: 1,
      step: 1,
      buttonText: 'Verder',
      radioGroup: 1,
      luggagePicked: false,
      luggageChoice: [],
      luggageList: [
        'Geen bagage',
        'Boodschappen',
        'Handbagage',
        'Buggy',
        'Rollator',
        'Huisdier',
      ],
      timeDrivePicked: false,
      timeDriveList: [
        'Nee, ik rijd niet om.',
        'Ja, maximaal 5 minuten.',
        'Ja, maximaal 10 minuten.',
        'Ja, maximaal 20 minuten.',
      ],
      kenteken: '',
      brand: null,
      model: null,
      color: null,
      licenseRules: [
        v => !!v || 'Kenteken moet worden ingevuld!',
        v => /^[A-Z 0-9]*$/.test(v) || 'Kenteken moet geldig zijn!',
        v => (v && v.length === 6) || 'Een kenteken bevat 6 tekens',
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
      this.step++
      if (this.step === 4) {
        this.buttonText = 'Zoek'
      } else if (this.step === 5) {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('getLicenseInfo', this.kenteken)
          this.buttonText = 'Bevestig en plan rit!'
        } else {
          this.step--
        }
      } else if (this.step === 6) {
        this.$router.push('ridePlanned')
      }
    },
    radioChangeDriveTime: function(drive) {
      this.timeDrivePicked = true
      this.$store.commit('setRideOfferPreferencesRepeat', {
        drivingTime: drive,
      })
    },
    checkboxLuggageOnClick: function() {
      this.luggagePicked = true
      let result = ''
      for (let i = 0; i < this.luggageChoice.length; i++) {
        result += this.luggageChoice[i]
        if (i !== this.luggageChoice.length - 1) {
          result += ', '
        }
      }
      this.$store.commit('setRideOfferPreferencesRepeat', { luggage: result })
    },
    setDisabled() {
      if (this.step === 2) {
        return this.luggagePicked
      } else if (this.step === 3) {
        return this.timeDrivePicked
      }
      return true
    },
  },
}
</script>

<style lang="scss">
#inputPersons {
  text-align: center;
}
</style>
