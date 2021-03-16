<template>
  <v-form>
    <v-container class="pa-1">
      <v-row>
        <v-col>
          <v-text-field
            v-model="value.name"
            :rules="[rules.required]"
            label="Naam"
            class="bg-white"
            outlined
            dense
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0">
          <v-combobox
            :value="value.location.label"
            :rules="[rules.required]"
            :items="suggestions"
            label="Locatie"
            class="bg-white"
            outlined
            dense
            @input="onLocationSelect"
            @update:search-input="onLocationUpdate"
          >
          </v-combobox>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            v-model="value.description"
            class="bg-white"
            hide-details
            outlined
            dense
            label="Omschrijving"
            rows="3"
          >
          </v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="label" cols="2">Plaatje:</v-col>
        <v-col>
          <v-text-field class="bg-white" hide-details dense type="file" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="value.goalAmount"
            :rules="[rules.required]"
            label="Doel bedrag"
            class="bg-white"
            type="number"
            hide-details
            outlined
            dense
            prefix="€"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-dialog v-model="showStartDatePicker" persistent>
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="pickedStartDate"
                :rules="[rules.required]"
                label="Start datum"
                prepend-icon="event"
                hide-details
                class="my-0 py-0"
                v-on="on"
              >
              </v-text-field>
            </template>
            <!-- v-if forces initialization of date picker when dialog is reopened -->
            <v-date-picker
              v-if="showStartDatePicker"
              v-model="pickedStartDate"
              locale="nl-NL"
              scrollable
            >
              <v-btn text color="primary" @click="cancelStartDate">
                Annuleren
              </v-btn>
              <v-btn
                text
                color="primary"
                :disabled="!pickedStartDate"
                @click="confirmStartDate"
              >
                Ok
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-dialog v-model="showEndDatePicker" persistent>
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="pickedEndDate"
                label="Eind datum"
                readonly
                prepend-icon="event"
                hide-details
                class="my-0 py-0"
                v-on="on"
              >
              </v-text-field>
            </template>
            <!-- v-if forces initialization of date picker when dialog is reopened -->
            <v-date-picker
              v-if="showEndDatePicker"
              v-model="pickedEndDate"
              locale="nl-NL"
              scrollable
            >
              <v-btn text color="primary" @click="cancelEndDate">
                Annuleren
              </v-btn>
              <v-btn
                text
                color="primary"
                :disabled="!pickedEndDate"
                @click="confirmEndDate"
              >
                Ok
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { throttle } from 'lodash'
import * as gsStore from '@/store/geocoder-service'

export default {
  name: 'CharityDetails',
  props: {
    value: { type: Object, default: () => {} },
  },
  data() {
    return {
      showStartDatePicker: false,
      pickedStartDate: null,
      showEndDatePicker: false,
      pickedEndDate: null,
      rules: {
        required: value => !!value || 'Verplicht veld',
      },
    }
  },
  computed: {
    suggestions() {
      return gsStore.getters.getGeocoderSuggestions.map(s => {
        const vicinity = s.vicinity.replace('<br/>', ', ')
        return {
          text: `${s.title} ${vicinity} (${s.categoryTitle})`,
          value: s,
        }
      })
    },
  },
  methods: {
    onLocationUpdate: throttle(val => {
      if (val && val.length > 2) {
        gsStore.actions.fetchGeocoderSuggestions({ query: val })
      } else {
        gsStore.mutations.setGeocoderSuggestions([])
      }
    }, 500),
    onLocationSelect(evt) {
      this.value.location = {
        label: evt.value.title,
        latitude: evt.value.position[0],
        longitude: evt.value.position[1],
      }
    },
    cancelStartDate() {
      this.showStartDatePicker = false
    },
    cancelEndDate() {
      this.showEndDatePicker = false
    },
    confirmStartDate() {
      this.showStartDatePicker = false
      this.value.campaignStartTime = this.pickedStartDate
    },
    confirmEndDate() {
      this.showEndDatePicker = false
      this.value.campaignEndTime = this.pickedEndDate
    },
  },
}
</script>

<style scoped>
.label {
  padding-top: 18px;
}
</style>
