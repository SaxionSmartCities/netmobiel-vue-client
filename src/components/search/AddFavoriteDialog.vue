<template>
  <v-dialog v-model="show" persistent>
    <v-card>
      <v-card-title>Favoriet toevoegen</v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="col-2 favo-icon">
            <v-icon>
              {{ iconicCategory(location.category) }}
            </v-icon>
          </v-col>
          <v-col>
            <v-row>
              <v-text-field
                v-model="location.title"
                label="Naam favoriet"
                :rules="rules"
              />
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <h4>Locatie</h4>
            <em>{{ locationLabel }}</em>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-row justify="end">
            <v-col>
              <v-btn
                rounded
                block
                outlined
                color="primary"
                @click="onCancelFavorite()"
              >
                Annuleer
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                rounded
                block
                depressed
                color="button"
                :disabled="location.title.length < 3"
                @click="onSaveFavorite()"
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
    show: { type: Boolean, default: true },
  },
  data() {
    return {
      rules: [v => v.length >= 3 || 'Minimaal 3 karakters'],
    }
  },
  computed: {
    locationLabel() {
      const { street, postalCode, locality } = this.location
      if (postalCode != undefined) {
        if (street != undefined) {
          return `${street}, ${postalCode} ${locality}`
        } else {
          return `${postalCode} ${locality}`
        }
      }
      return `${locality}`
    },
  },
  methods: {
    onCancelFavorite() {
      this.$emit('onCancelFavorite')
    },
    onSaveFavorite() {
      this.$emit('onAddFavorite', {
        ...this.location,
        label: this.location.title,
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

<style lang="scss">
.favo-icon {
  padding-top: 20px;
}
</style>
