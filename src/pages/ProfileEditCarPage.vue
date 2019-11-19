<template>
  <v-container>
    <v-layout column>
      <v-flex mb-3>
        <h3>{{ isEditing ? 'Auto wijzigen' : 'Auto instellingen' }}</h3>
      </v-flex>
      <v-divider />
      <v-flex>
        <v-layout align-center my-2>
          <v-flex xs3>
            Kenteken
          </v-flex>
          <v-flex xs9>
            <span class="license-plate" v-text="car.licensePlate" />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout align-center my-1>
          <v-flex xs3 />
          <v-flex xs9 text-truncate>
            <span class="car-make">
              {{ car.brand }}, {{ car.model }} ({{ car.registrationYear }})
            </span>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 mt-2>
        <span>Hoeveel personen kan je meenemen?</span>
      </v-flex>
      <v-flex>
        <v-layout>
          <v-text-field
            v-model.number="personCount"
            class="border-radius-input"
            single-line
            :rules="[rules.personCount]"
            min="1"
            max="6"
            type="number"
          />
        </v-layout>
      </v-flex>
      <v-flex xs12 mt-2>
        <span>Wat voor bagage kan je kwijt?</span>
      </v-flex>
      <v-flex>
        <v-layout row mt-2>
          <v-flex xs6>
            <div
              v-for="type in ['GROCERIES', 'PET', 'HANDLUGGAGE']"
              :key="type"
            >
              <v-checkbox
                :id="type"
                v-model="luggageOptions"
                class="ma-0 pa-0"
                :label="luggageTypes[type].label"
                :value="type"
              />
            </div>
          </v-flex>
          <v-flex xs6>
            <div
              v-for="type in ['STROLLER', 'WALKER', 'WHEELCHAIR']"
              :key="type"
            >
              <v-checkbox
                :id="type"
                v-model="luggageOptions"
                class="ma-0 pa-0"
                :label="luggageTypes[type].label"
                :value="type"
              />
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout row class="actions">
          <v-flex xs6>
            <v-btn small round outline color="#2E8997" @click="cancelCar()">
              {{ isEditing ? 'Auto verwijderen' : 'Annuleren' }}
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn small round block :disabled="!isValid" @click="saveCar()">
              Opslaan
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import luggageTypes from '@/constants/luggage-types.js'

const BAD_PERSON_COUNT = 'Voer een geheel getal tussen 1 en 6.'

function validatePersonCount(n) {
  return ~~n === n && n >= 1 && n <= 6
}

export default {
  name: 'ProfileEditCar',
  data: function() {
    return {
      car: {},
      personCount: 2,
      luggageOptions: [],
      rules: {
        personCount: n => (validatePersonCount(n) ? true : BAD_PERSON_COUNT),
      },
    }
  },
  computed: {
    isEditing() {
      return this.car.id
    },
    luggageTypes() {
      return luggageTypes
    },
    isValid() {
      return validatePersonCount(this.personCount)
    },
  },
  mounted() {
    // either result from RDW search or car from user profile
    const result = this.$store.getters['cs/getSearchResult']
    if (!result) {
      // unexpected navigation to this page. go back to home
      this.$router.replace('/home')
    }
    // if id is set, it must be a car from user profile
    this.car = result.id
      ? result
      : // if car with same license plate is part of profile, edit/remove car from profile
        this.$store.getters['ps/getUser'].profile.ridePlanOptions.cars.find(
          candidate => candidate.licensePlate === result.licensePlate
        ) ||
        // otherwise add new car to profile
        result
    this.personCount = this.car.nrSeats > 1 ? this.car.nrSeats - 1 : 2
  },
}
</script>

<style lang="scss" scoped>
.license-plate {
  text-transform: uppercase;
}
.car-make {
  font-style: italic;
  font-size: 80%;
  color: $color-mid-grey;
}
.erroneous {
  color: red;
}
.actions {
  padding-bottom: calc(56px + 1em);
}
</style>
