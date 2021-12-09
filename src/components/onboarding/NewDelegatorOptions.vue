<template>
  <v-row no-gutters>
    <v-col dense>
      <v-row>
        <v-col class="pb-0">
          Heeft <em>{{ user.firstName }}</em> bagage mee op reis?
        </v-col>
      </v-row>
      <v-row>
        <v-col class="options ma-2">
          <v-expansion-panels accordion>
            <search-options-icon-expansion-panel
              v-model="luggage"
              class="pa-0"
              @onChanged="
                (newLuggage) => {
                  luggage = newLuggage
                }
              "
            />
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col> Wat moet de chauffeur weten? </v-col>
      </v-row>
      <v-row>
        <v-col class="options ma-2">
          <v-row v-for="(option, index) in userOptions" :key="index">
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
          Kan <em>{{ user.firstName }}</em> bij aankomst vervoerder direct
          instappen?
        </v-col>
      </v-row>
      <v-row>
        <v-col class="options ma-2">
          <v-radio-group v-model="options.extraTransferTime">
            <v-radio label="Ja" value="false" />
            <v-radio
              label="Nee (de chauffeur houdt rekening met extra instaptijd."
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
      user: this.value.user,
      options: this.value.options,
      luggageOptions: [],
      userOptions: [
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
          selected: this.luggageOptions.map((o) => luggageTypes[o]),
        }
      },
      set(selection) {
        this.luggageOptions = selection.selected.map((option) => option.type)
      },
    },
    luggageSelected: {
      get() {
        return this.luggageOptions.map((option) => luggageTypes[option])
      },
      set(selection) {
        this.luggageOptions = selection.map((x) => x.type)
      },
    },
  },
  methods: {
    saveSearchOptions() {
      // eslint-disable-next-line
      console.log('TODO')
    },
    onOptionChange() {
      // eslint-disable-next-line
      console.log('TODO')
    },
  },
}
</script>
