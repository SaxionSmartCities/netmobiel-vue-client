<template>
  <v-row dense>
    <v-col>
      <v-row>
        <v-col>
          <v-text-field
            class="bg-white"
            hide-details
            outlined
            readonly
            dense
            label="Naam"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            class="bg-white"
            hide-details
            outlined
            dense
            label="Locatie"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            class="bg-white"
            hide-details
            outlined
            dense
            label="Omschrijving"
          >
          </v-text-field>
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
            class="bg-white"
            hide-details
            outlined
            readonly
            dense
            label="Doel bedrag"
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
                label="Start datum"
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
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CharityDetails',
  props: {
    charity: { type: Object, default: () => {} },
  },
  data() {
    return {
      showStartDatePicker: false,
      pickedStartDate: null,
      showEndDatePicker: false,
      pickedEndDate: null,
    }
  },
  methods: {
    cancelStartDate() {
      this.showStartDatePicker = false
    },
    cancelEndDate() {
      this.showEndDatePicker = false
    },
    confirmStartDate() {
      this.showStartDatePicker = false
    },
    confirmEndDate() {
      this.showEndDatePicker = false
    },
  },
}
</script>

<style scoped>
.label {
  padding-top: 18px;
}
</style>
