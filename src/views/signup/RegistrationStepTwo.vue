<template>
  <div id="form">
    <div>
      <form>
        <div class="text-center">
          <h6>Dag Laura!</h6>
          <small
            >Op deze pagina kunt u uw voorkeuren opgeven voor het reizen met
            Netmobiel.</small
          >
        </div>
        <div>
          <p>Geboortedatum*</p>
          <div class="form-group row" style="margin-bottom: 0px">
            <div class="col-3">
              <small>Dag</small>
            </div>
            <div class="col-3" style="padding-left: 9%">
              <small>Maand</small>
            </div>
            <div class="col-3" style="padding-left: 13%">
              <small>Jaar</small>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-3">
              <input
                id="day"
                v-model="dayOfBirth"
                type="number"
                class="form-control"
                :placeholder="currentDay"
                required
              />
            </div>
            <h3>-</h3>
            <div class="col-3">
              <input
                id="month"
                v-model="monthOfBirth"
                type="number"
                class="form-control"
                :placeholder="currentMonth"
                required
              />
            </div>
            <h3>-</h3>
            <div class="col-4">
              <input
                id="year"
                v-model="yearOfBirth"
                type="number"
                class="form-control"
                :placeholder="currentYear"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <p>Vertel iets over uzelf:</p>
          <div class="col-auto" style="padding-left: 0px">
            <textarea
              id="biografy"
              v-model="biography"
              type="text"
              class="form-control"
              placeholder="vertel iets over uzelf:"
              required
            >
            </textarea>
          </div>
          <small>*Verplichte velden</small>
        </div>
        <button class="btn btn-block btn-secondary" @click="submitForm($event)">
          Volgende stap
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistrationStepTwo',
  data: function() {
    return {
      currentDay: this.$store.getters.getCurrentDate.getDate(),
      currentMonth: this.$store.getters.getCurrentDate.getMonth() + 1,
      currentYear: this.$store.getters.getCurrentDate.getFullYear(),
      dayOfBirth: '',
      monthOfBirth: '',
      yearOfBirth: '',
      //
      biography: '',
    }
  },
  methods: {
    submitForm: function(event) {
      event.preventDefault()
      //logic to get the date from the text field
      var storeData = {
        dateOfBirth: new Date(
          this.yearOfBirth,
          this.dayOfBirth,
          this.monthOfBirth
        ),
        biography: this.$data.biography,
      }
      this.$store.commit('saveUser', storeData)
      this.$store.commit('incrementRegistrationStep', 1)
    },
  },
}
</script>

<style lang="scss">
h6 {
  color: $color-secondary;
}
p {
  color: #555555;
  margin-top: 5%;
  margin-bottom: 2px;
}
button {
  margin-top: 5%;
}
small {
  color: #aeb1b3;
}
</style>
