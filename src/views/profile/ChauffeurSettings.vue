<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-layout pt-3>
          <v-flex>
            <p class="text-primary-uppercase">Chauffeur</p>
          </v-flex>
        </v-layout>

        <v-layout column>
          <v-flex>
            <v-divider></v-divider>
            <v-layout align-center mr-3>
              <v-flex>
                <p class="body-1 mb-0">Ben ik een chauffeur</p>
              </v-flex>
              <v-flex xs1>
                <v-switch
                  :input-value="getChauffeur"
                  color="#2E8997"
                  @change="setChauffeur($event)"
                ></v-switch>
              </v-flex>
            </v-layout>

            <v-layout pt-3>
              <v-flex>
                <p class="text-primary-uppercase">Mijn auto</p>
              </v-flex>
            </v-layout>
            <v-layout column>
              <v-flex v-for="option in Object.keys(carOptions)" :key="option">
                <v-divider></v-divider>
                <v-layout align-center mr-3>
                  <v-flex>
                    <p class="body-1 mb-0 font-weight-bold">{{ option }}</p>
                  </v-flex>
                  <v-flex xs8>
                    <v-text-field
                      class="pb-0 pt-1 body-2"
                      :id="option"
                      :value="carOptions[option]"
                      @change="setData(option, $event)"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>

            <v-layout pt-3>
              <v-flex>
                <p class="text-primary-uppercase">Extra instellingen</p>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'ChauffeurSettings',
  data() {
    return {}
  },
  computed: {
    getChauffeur() {
      return this.$store.getters.isChauffeur
    },
    carOptions() {
      return this.$store.getters.getCarInfo
    },
  },
  methods: {
    setChauffeur(value) {
      this.$store.commit('setChauffeurValue', value)
    },
    setData(key, value) {
      let object = {}
      object[key] = value
      this.$store.commit('setCarInfo', object)
    },
  },
}
</script>

<style lang="scss"></style>
