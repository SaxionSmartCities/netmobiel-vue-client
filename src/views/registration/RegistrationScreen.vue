<template>
  <v-form>
    <v-container v-if="step === 1" grid-list-xs>
      <v-layout pa-3
        ><v-flex text-xs-center><h1>Accountgegevens</h1></v-flex></v-layout
      >
      <v-layout pa-1 vertical-align-center>
        <v-flex xs3>
          <span>Gebruikersnaam</span>
        </v-flex>
        <v-flex xs9>
          <v-text-field required></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout pa-1 vertical-align-center>
        <v-flex xs3>
          <span>Email</span>
        </v-flex>
        <v-flex xs9>
          <v-text-field required></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout pa-1 vertical align-center>
        <v-flex xs3>
          <span>Geboortedatum</span>
        </v-flex>
        <v-flex xs9>
          <v-text-field required></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout pa-1 vertical-align-center>
        <v-flex xs3>
          <span>Wachtwoord</span>
        </v-flex>
        <v-flex xs9>
          <v-text-field required></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout pa-1 vertical-align-center>
        <v-flex xs3>
          <span>Wachtwoord (herhaling)</span>
        </v-flex>
        <v-flex xs9>
          <v-text-field required></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout mt-5>
        <v-flex text-xs-center>
          <v-btn class="full-width" @click="step = 2">Volgende scherm</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container v-if="step === 2" grid-list-xs>
      <v-layout pa-3>
        <v-flex text-xs-center><h1>Flexibiliteit en bagage</h1></v-flex>
      </v-layout>
      <v-layout pa-1 vertical-align-center>
        <v-flex xs3>
          <span>Max. looptafstand</span>
        </v-flex>
        <v-flex xs9> </v-flex>
      </v-layout>
      <v-layout pa-1 vertical-align-center>
        <v-flex xs3>
          <span>Ik reis en meestal neem ik mee:</span>
        </v-flex>
        <v-layout xs9>
          <v-btn-toggle v-model="toggle_multiple" class="transparent" multiple>
            <v-flex>
              <v-btn :value="1" flat>
                <v-icon>pets</v-icon>
              </v-btn>
            </v-flex>
            <v-flex>
              <v-btn :value="2" flat>
                <v-icon>accessible</v-icon>
              </v-btn>
            </v-flex>
            <v-flex>
              <v-btn :value="3" flat>
                <v-icon>child_friendly</v-icon>
              </v-btn>
            </v-flex>
          </v-btn-toggle>
        </v-layout>
      </v-layout>
      <v-layout mt-5>
        <v-flex text-xs-center>
          <v-btn class="full-width">Volgende scherm</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'RegistrationScreen',
  data: function() {
    return {
      step: 1,
      toggle_multiple: [1, 2, 3],
      userProfile: {
        name: '',
        email: '',
        password: '',
        repeatpassword: '',
        agree: false,
      },
    }
  },
  beforeCreate() {
    this.$store.commit('disableFooter')
  },
  beforeDestroy() {
    this.$store.commit('enableFooter')
  },
  methods: {
    submitForm: function(event) {
      event.preventDefault()

      console.log('submitting form')
    },
  },
}
</script>

<style scoped lang="scss">
.form-label {
  align-self: center;
}
</style>
