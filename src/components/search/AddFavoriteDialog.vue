<template>
  <v-dialog v-model="favoriteModal" persistent>
    <v-card>
      <v-card-title>Locatie toevoegen</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            Geef eventueel een andere naam voor
            {{ location.title }}
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="favoriteLabel" label="Locatienaam">
            </v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-row justify="end">
            <v-btn
              text
              @click="
                makeFavorite()
                favoriteModal = false
              "
            >
              Bevestig
            </v-btn>
            <v-btn text @click="favoriteModal = false">
              Annuleer
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AddFavoriteDialog',
  props: {
    location: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      favoriteLabel: undefined,
      favoriteModal: true,
    }
  },
  watch: {
    location(newValue) {
      console.log('location changed!', newValue)
    },
  },
  mounted: function() {
    this.favoriteModal = location !== undefined
  },
  methods: {
    makeFavorite() {
      let newLocation = {
        ...this.location,
        label: this.favoriteLabel,
      }
      this.$emit('favoriteConfirmed', newLocation)
    },
  },
}
</script>

<style lang="scss"></style>
