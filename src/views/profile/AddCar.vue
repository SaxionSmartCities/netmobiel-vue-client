<template>
  <v-container>
    <v-layout>
      <v-flex>
        <p class="headline">Voeg een auto toe</p>
      </v-flex>
    </v-layout>
    <v-layout justify-space-around>
      <v-flex xs8>
        <v-text-field v-model="car.license" label="Voer hier uw kenteken" solo>
        </v-text-field>
      </v-flex>
      <v-flex shrink>
        <v-btn large @click="fetchCarProps">
          Zoek
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout justify-center align-center my-1>
      <v-flex>
        <v-layout v-if="getTempCar" column>
          <v-flex>
            <v-text-field
              :value="getTempCar.brand"
              readonly
              label="Merk"
              class="pb-0 pt-1 body-2"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field
              :value="getTempCar.model"
              readonly
              label="Model"
              class="pb-0 pt-1 body-2"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field
              :value="getTempCar.color"
              label="Kleur"
              class="pb-0 pt-1 body-2"
              @change="setColorCar($event)"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex shrink>
        <v-btn @click="saveCar">Opslaan</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'AddCar',
  data() {
    return {
      car: { license: '' },
    }
  },
  computed: {
    getTempCar() {
      return this.$store.getters.getTempCar
    },
  },
  methods: {
    fetchCarProps() {
      this.$store.dispatch('getLicenseInfo', {
        license: this.car.license,
        temp: true,
      })
    },
    saveCar() {
      this.$store.commit('addCar', this.getTempCar)
        this.$router.go(-1)
    },
  },
}
</script>

<style scoped></style>
