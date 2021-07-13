<template>
  <v-row no-gutters>
    <v-col dense>
      <v-row>
        <v-col class="pb-0">
          Heeft <em>{{ value.firstName }}</em> bagage mee op reis?
        </v-col>
      </v-row>
      <v-row>
        <v-col class="options ma-2">
          <v-expansion-panels accordion>
            <search-options-icon-expansion-panel
              v-model="luggage"
              class="pa-0"
              @onChanged="onLuggageChanged"
            />
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          Wat moet de chauffeur weten?
        </v-col>
      </v-row>
      <v-row>
        <v-col class="options ma-2">
          <v-row v-for="(option, index) in options" :key="index">
            <v-col class="d-flex align-center py-0">
              <span>{{ option.title }}</span>
            </v-col>
            <v-col class="shrink d-flex align-center px-0 py-2">
              <v-switch
                v-model="option.value"
                class="switch-overwrite"
                hide-details
                inset
                @change="onOptionChange"
              ></v-switch>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          Kan <em>{{ value.firstName }}</em> bij aankomst vervoerder direct
          instappen?
        </v-col>
      </v-row>
      <v-row>
        <v-col class="options ma-2">
          <v-radio-group v-model="extraTransferTime">
            <v-radio label="Ja" value="false" />
            <v-radio
              label="Nee (de chauffeur houdt rekening met extra instaptijd)"
              value="true"
            />
          </v-radio-group>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import SearchOptionsIconExpansionPanel from '@/components/search/SearchOptionsIconExpansionPanel'
import luggageTypes from '@/constants/luggage-types.js'

export default {
  name: 'DelegationOptions',
  components: { SearchOptionsIconExpansionPanel },
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      options: [
        { title: 'Slechthorend', value: false },
        { title: 'Verminderd gezichtsvermogen', value: false },
        { title: 'Moeite met instappen', value: false },
      ],
    }
  },
  computed: {
    luggage: {
      get() {
        return {
          title: 'Bagage',
          options: luggageTypes,
          selected: this.value.searchPreferences.luggageOptions.map(
            o => luggageTypes[o]
          ),
        }
      },
      set(selection) {
        this.value.searchPreferences.luggageOptions = selection.selected.map(
          option => option.type
        )
      },
    },
    extraTransferTime: {
      get() {
        return `${this.value.extraTransferTime}`
      },
      set(value) {
        this.value.extraTransferTime = value == 'true'
      },
    },
  },
  methods: {
    onLuggageChanged(newLuggage) {
      this.luggage = newLuggage
    },
    onOptionChange(option) {
      // TODO: Find somewhere in the profile to store this information.
      // eslint-disable-next-line
      console.log(`TODO: ${JSON.stringify(this.options)}`)
    },
  },
}
</script>
