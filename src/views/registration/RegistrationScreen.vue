<template>
  <v-form>
    <v-container grid-list-xs>
      <v-layout pa-3
        ><v-flex text-xs-center><h1>Registration</h1></v-flex></v-layout
      >
      <v-layout pa-1>
        <v-flex xs3>
          <span>Gebruikersnaam</span>
        </v-flex>
        <v-flex xs9>
          <v-text-field label="First name" solo required></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout pa-1>
        <v-flex xs3>
          <span>Email</span>
        </v-flex>
        <v-flex xs9>
          <v-text-field label="First name" solo required></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout pa-1>
        <v-flex xs3>
          <span>Wachtwoord</span>
        </v-flex>
        <v-flex xs9>
          <v-text-field label="First name" solo required></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout pa-1>
        <v-flex xs3>
          <span>Wachtwoord (herhaling)</span>
        </v-flex>
        <v-flex xs9>
          <v-text-field label="First name" solo required></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
  <!-- 
  <div class="component-padding full-height">
    <form>
      <div class="md-layout md-layout-item">
        <div class="md-layout-item border-bottom"><h1>Registratie</h1></div>
      </div>
      <div class="md-layout md-gutter md-alignment-center border-bottom">
        <div class="md-layout-item md-size-33 text-label">Gebruikersnaam</div>
        <div class="md-layout-item md-size-66 text-input">
          <md-field md-inline>
            <label>Naam</label>
            <md-input v-model="name"></md-input>
          </md-field>
        </div>
      </div>
      <div class="md-layout md-gutter md-alignment-center border-bottom">
        <div class="md-layout-item md-size-33 text-label">Email</div>
        <div class="md-layout-item md-size-66 text-input">
          <md-field md-inline>
            <label>Email</label>
            <md-input v-model="email" type="email" required></md-input>
          </md-field>
        </div>
      </div>
      <div class="md-layout md-gutter md-alignment-center border-bottom">
        <div class="md-layout-item md-size-33 text-label">Wachtwoord</div>
        <div class="md-layout-item md-size-66 text-input">
          <md-field md-inline>
            <label>Wachtwoord</label>
            <md-input v-model="password" type="password" required></md-input>
          </md-field>
        </div>
      </div>
      <div class="md-layout md-gutter md-alignment-center border-bottom">
        <div class="md-layout-item md-size-33 text-label">
          Wachtwoord herhalen
        </div>
        <div class="md-layout-item md-size-66 text-input ">
          <md-field md-inline>
            <label>Wachtwoord (herhalen)</label>
            <md-input
              v-model="repeatpassword"
              type="password"
              required
            ></md-input>
          </md-field>
        </div>
      </div>
      <div class="md-layout">
        <md-button
          class="full-width md-raised page-button margin-top-40"
          @click="submitForm($event)"
          >Volgende stap</md-button
        >
      </div>
    </form>
  </div> -->
</template>

<script>
export default {
  name: 'RegistrationScreen',
  data: function() {
    return {
      name: '',
      email: '',
      password: '',
      repeatpassword: '',
      agree: false,
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
.label {
  align-items: center;
}

.margin-top-40 {
  margin-top: 40px;
}
</style>
