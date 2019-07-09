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
        <v-radio-group v-model="radioGroup">
          <v-radio
            v-for="n in customChoices"
            :key="n"
            :label="n"
            :value="n"
            @change="radioChangeCustom(n)"
          ></v-radio>
        </v-radio-group>
        <fieldset>
          <legend>Please select one of the following</legend>
          <input type="radio" name="action" id="track" value="track" /><label for="track">Track Submission</label><br />
          <input type="radio" name="action" id="event" value="event"  /><label for="event">Events and Artist booking</label><br />
          <input type="radio" name="action" id="message" value="message" /><label for="message">Message us</label><br />
        </fieldset>
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
      radioGroupCustom: [],
      custom: false,
      choices: [
        'Eenmalig',
        'Elke dag',
        'Elke werkdag',
        'Elke week',
        'Elk weekend',
        'Elke twee weken',
        'Elke maand',
        // 'Aangepast...',
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
        this.$store.commit('setRideOfferPreferencesRepeat', n)
      } else {
        this.custom = true
      }
    },
    radioChangeCustom: function(n) {},
  },
}
</script>

<style scoped></style>
