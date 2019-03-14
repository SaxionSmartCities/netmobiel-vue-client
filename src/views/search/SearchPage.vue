<template>
  <div class="container">
    <form>
      <div class="box-widget mt-3 mb-3 background-primary">
        <h3 class="left-align">Plan uw reis</h3>
        <div class="form-group row">
          <label for="from" class="col-1 col-form-label">
            <i class="fas fa-home"></i>
          </label>
          <div class="col-10">
            <input
              type="text"
              class="form-control"
              id="from"
              placeholder="Huidige locatie"
              required
            >
          </div>
        </div>
        <div class="form-group row">
          <label for="from" class="col-1 col-form-label">
            <i class="fas fa-map-marker-alt"></i>
          </label>
          <div class="col-10">
            <input type="text" class="form-control" id="from" placeholder="Bestemming" required>
          </div>
        </div>
        <div class="form-group row">
          <label for="from" class="col-1 col-form-label">
            <i class="fas fa-clock"></i>
          </label>
          <div class="col-5">
            <input type="time" class="form-control" id="from" placeholder="Vertrektijd" required>
          </div>
          <div class="col-5">
            <input type="text" class="form-control" id="from" placeholder="+/- 10 min" required>
          </div>
        </div>

        <p class="text-small text-center" @click="showOptions">Meer opties</p>
        <div v-if="!isOptionsHidden">
          <div class="row">
            <label class="col-10 col-form-label">Extra voorkeuren</label>
            <label class="col-auto col-form-label"><i class="fa fa-info"></i> </label>
          </div>
          <div class="form-group row">
            <label class="col-7 col-form-label" id="label_number_of_persons">Aantal personen</label>
            <div class="col-5">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <button class="btn background-secondary" type="button"
                          id="btn_number_of_persons_min" @click="incrementAmountofPersons(-1)">-
                  </button>
                </div>
                <input type="number" class="col-4 form-control" id="input_number_of_persons"
                       :value="amountOfPersons" required>
                <div class="input-group-append">
                  <button class="btn background-secondary" type="button"
                          id="btn_number_of_persons_plus" @click="incrementAmountofPersons(1)">+
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class-="row">
            <label class="col-6 col-form-label" id="label_switch_transport">Overstappen:</label>
            <b-form-checkbox class="col-auto" id="checkbox_switch_transport"
                             value="accepted" unchecked-value="not_accepted" v-model="status">
            </b-form-checkbox>
          </div>
          <div class="row">
            <toggle-button class="col" title="baggage" icon="fa fa-shopping-bag"></toggle-button>
            <toggle-button class="col" title="animal" icon="fas fa-cat"></toggle-button>
            <toggle-button class="col" title="baby" icon="fas fa-baby"></toggle-button>
          </div>
        </div>
      </div>

      <button class="btn btn-primary btn-block">Zoek mijn reis</button>
    </form>
  </div>
</template>

<script>
  import ToggleButton from "@/views/common/ToggleButton.vue"
export default {
  components: {
    ToggleButton
  },
  data: function(){
    return {
      isOptionsHidden: true,
      amountOfPersons: 1,
      status: 'not accepted'
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    showOptions: function(){
      this.isOptionsHidden = !this.isOptionsHidden;
    },
    incrementAmountofPersons: function (number) {
      if (this.amountOfPersons + number > 0) {
        this.amountOfPersons = this.amountOfPersons + number;
      }
    }
  }
};
</script>

<style lang="scss">
  #btn_number_of_persons_plus{
    background-color: $color-secondary-dark;
    color: $color-primary;
  }

  #btn_number_of_persons_min{
    background-color: $color-secondary-dark;
    color: $color-primary;
  }

  #label_number_of_persons{
    margin-right: 0;
  }

  #label_switch_transport {
    padding-left: 0;
  }

  .custom-control-label::after{
    background-color: #095e5b;
    -ms-transform: scale(1.2); /* IE /
    -moz-transform: scale(1.2); /* FF */
    -webkit-transform: scale(1.2); /* Safari and Chrome */
    -o-transform: scale(1.2); /* Opera */
    padding: 10px;
  }
</style>
