<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-card-title>Favoriet toevoegen</v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="col-2 favo-icon">
            <v-icon>
              {{ location.iconName }}
            </v-icon>
          </v-col>
          <v-col>
            <v-row>
              <v-text-field
                v-model="name"
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
                :disabled="name.length < 3"
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
import { geoPlaceToAddressLabel } from '@/utils/Utils'

export default {
  name: 'AddFavoriteDialog',
  props: {
    location: { type: Object, required: true },
    initialName: { type: String, required: false, default: '' },
    show: { type: Boolean, default: true },
  },
  data() {
    return {
      dialog: this.show,
      rules: [(v) => v.length >= 3 || 'Minimaal 3 karakters'],
      name: this.initialName,
    }
  },
  computed: {
    locationLabel() {
      return geoPlaceToAddressLabel(this.location, true)
    },
  },
  methods: {
    onCancelFavorite() {
      this.$emit('onCancelFavorite')
    },
    onSaveFavorite() {
      this.$emit('onAddFavorite', {
        ...this.location,
        name: this.name,
        favorite: true,
      })
    },
  },
}
</script>

<style lang="scss">
.favo-icon {
  padding-top: 20px;
}
</style>
