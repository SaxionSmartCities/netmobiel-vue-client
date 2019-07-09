<template
  ><v-container>
    <v-layout v-if="!custom" column>
      <v-flex mb-4>
        <h2>Herhalen</h2>
      </v-flex>
      <v-flex> <v-divider></v-divider> </v-flex>
      <v-flex>
        <v-radio-group v-model="radioGroup">
          <v-radio
            v-for="n in choices"
            :key="n"
            :label="n"
            :value="n"
            @change="radioChange(n)"
          ></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
    <v-layout v-else column>
      <v-flex mb-4>
        <h2>Aangepast</h2>
      </v-flex>
      <v-flex> <v-divider></v-divider> </v-flex>
      <v-flex>
        <v-layout column>
          <v-flex v-for="n in customChoices" :key="n">
            <v-checkbox
              v-model="choiceCustom"
              class="checkboxDaySelect"
              :label="n"
              :value="n"
              @change="checkboxOnClick"
            ></v-checkbox>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout> </v-container
></template>

<script>
export default {
  name: 'RepeatSelection',
  data: function() {
    return {
      test: '',
      radioGroup: this.$store.getters.getRideOfferPreferences.repeat,
      choiceCustom: [],
      custom: false,
      choices: [
        'Eenmalig',
        'Elke dag',
        'Elke werkdag',
        'Elke week',
        'Elk weekend',
        'Elke twee weken',
        'Elke maand',
        'Aangepast...',
      ],
      customChoices: [
        'Maandag',
        'Dinsdag',
        'Woensdag',
        'Donderdag',
        'Vrijdag',
        'Zaterdag',
        'Zondag',
      ],
    }
  },
  beforeCreate: function() {
    this.$store.commit('showBackButton')
  },
  beforeDestroy: function() {
    this.$store.commit('hideBackButton')
    this.custom = false
  },

  methods: {
    radioChange: function(n) {
      if (n !== 'Aangepast...') {
        this.$store.commit('setRideOfferPreferencesRepeat', {
          repeat: n,
        })
      } else {
        this.custom = true
      }
    },
    checkboxOnClick: function() {
      let result = ''
      for (let i = 0; i < this.choiceCustom.length; i++) {
        result += this.choiceCustom[i]
        if (i !== this.choiceCustom.length - 1) {
          result += ', '
        }
      }
      this.$store.commit('setRideOfferPreferencesRepeat', { repeat: result })
    },
  },
}
</script>

<style lang="scss">
.checkboxDaySelect {
  margin-top: 0px;
  margin-bottom: 0px;
  padding-top: 0px;
}
</style>
