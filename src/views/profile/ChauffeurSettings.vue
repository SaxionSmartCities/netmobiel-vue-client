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

            <v-layout>
              <v-flex>
                <v-divider></v-divider>
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
  computed: {
    getChauffeur() {
      return this.$store.getters.isChauffeur
    },
  },
  methods: {
    setChauffeur(value) {
      this.$store.commit('setChauffeurValue', value)
    },
  },
}
</script>

<style scoped></style>
