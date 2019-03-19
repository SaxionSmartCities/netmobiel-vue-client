<template>
  <div id="form">
    <div class="container box-widget background-primary mt-3">
      <div>
        <form>
          <div class="form-group">
            <label for="name"
              >Naam
              <sup>*</sup>
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="form-control"
              placeholder="Uw naam"
              required
            />
          </div>
          <div class="form-group">
            <label for="email"
              >E-mail
              <sup>*</sup>
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-control"
              placeholder="Uw e-mailadres"
              required
            />
          </div>
          <div class="form-group">
            <label for="password"
              >Wachtwoord
              <sup>*</sup>
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Uw wachtwoord"
              required
            />
          </div>
          <div class="form-group">
            <label for="repeatpassword"
              >Herhaal wachtwoord
              <sup>*</sup>
            </label>
            <input
              id="repeatpassword"
              v-model="repeatpassword"
              type="password"
              class="form-control"
              placeholder="Herhaal uw wachtwoord"
              required
            />
          </div>
          <p class="text-small"><sup>*</sup> Verplichte velden</p>
          <div class="form-check">
            <input
              id="agree"
              v-model="agree"
              class="form-check-input"
              type="checkbox"
              value
              required
            />
            <label class="form-check-label" for="agree">
              <p class="text-small">
                Ik ga akkoord met de algemene voorwaarden van Netmobiel
              </p>
            </label>
          </div>
          <button
            class="btn btn-block btn-secondary"
            @click="submitForm($event)"
          >
            Volgende stap
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserForm',
  data: function() {
    return {
      name: '',
      email: '',
      password: '',
      repeatpassword: '',
      agree: false,
    }
  },
  methods: {
    submitForm: function(event) {
      event.preventDefault()

      if (
        this.$data.agree &&
        this.$data.password === this.$data.repeatpassword
      ) {
        this.$store.commit('saveUser', this.$data)
        this.$router.push('/profile')
      } else {
        // Display pretty error message thingy..
        console.log('repeat password incorrect')
      }
    },
  },
}
</script>

<style lang="scss"></style>
