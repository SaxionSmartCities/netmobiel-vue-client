<template>
  <v-dialog v-model="favoriteModal" persistent>
    <v-card>
      <v-card-title>Favoriet toevoegen</v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="col-2">
            <v-icon>{{ iconicCategory(location.category) }}</v-icon>
          </v-col>
          <v-col>
            <v-row>
              <em>{{ location.title }}</em>
            </v-row>
            <v-row>{{ location.vicinity }}</v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="favoriteLabel" label="Naam favoriet">
            </v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-row justify="end">
            <v-col>
              <v-btn text block @click="favoriteModal = false">
                Annuleer
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                :disabled="!favoriteLabel"
                rounded
                block
                color="button"
                @click="
                  makeFavorite()
                  favoriteModal = false
                "
              >
                Opslaan
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import constants from '@/constants/constants.js'

export default {
  name: 'AddFavoriteDialog',
  props: {
    location: { type: Object, required: true },
  },
  data() {
    return {
      favoriteLabel: undefined,
      favoriteModal: true,
    }
  },
  mounted() {
    this.favoriteModal = location !== undefined
  },
  methods: {
    makeFavorite() {
      this.$emit('onAddFavorite', {
        ...this.location,
        label: this.favoriteLabel,
        favorite: true,
      })
    },
    iconicCategory(category) {
      return (
        constants.searchSuggestionCategoryIcons[category] ||
        constants.searchSuggestionDefaultIcon
      )
    },
  },
}
</script>

<style lang="scss"></style>
