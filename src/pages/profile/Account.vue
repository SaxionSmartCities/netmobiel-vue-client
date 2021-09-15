<template>
  <content-pane>
    <v-row>
      <v-col class="px-0">
        <span class="headline">Account</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0">
        <div v-for="section in sections" :key="section">
          <span
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            {{ section }}
          </span>
          <v-divider></v-divider>
          <template v-for="(item, index) in accountConfig[section]">
            <v-row
              :key="item.title"
              :class="{ 'mb-3': index === accountConfig[section].length - 1 }"
            >
              <v-col cols="5" class="d-flex flex-row">
                <span class="align-self-center body-1 font-weight-light">
                  {{ item.title }}
                </span>
              </v-col>
              <v-col
                cols="6"
                :class="{
                  'selected-property-column': selectedProperty === item.key,
                }"
                @click="selectedProperty = item.key"
              >
                <v-text-field
                  v-if="selectedProperty === item.key"
                  class="change-property-input"
                  :value="
                    item.format
                      ? item.format(get(user, item.key))
                      : get(user, item.key)
                  "
                  solo
                  autofocus
                  flat
                  single-line
                  clearable
                  :hide-details="true"
                  @change="onChangedInfoProperty"
                >
                </v-text-field>
                <span v-else>
                  {{
                    item.format
                      ? item.format(get(user, item.key))
                      : get(user, item.key)
                  }}
                </span>
              </v-col>
            </v-row>
            <v-divider
              v-if="index !== accountConfig[section].length - 1"
              :key="index"
            ></v-divider>
          </template>
        </div>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import account_config from '@/config/account_config'
import { geoSuggestionToPlace } from '@/utils/Utils'
import { get, set, isEqual } from 'lodash'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as gsStore from '@/store/geocoder-service'

export default {
  name: 'Account',
  components: { ContentPane },
  data() {
    return {
      accountConfig: account_config,
      selectedProperty: null,
    }
  },
  computed: {
    user() {
      return psStore.getters.getProfile
    },
    suggestions() {
      return gsStore.getters.getGeocoderSuggestions
    },
    sections() {
      return Object.keys(account_config)
    },
  },
  watch: {
    suggestions(newSug) {
      if (newSug.length > 0) {
        const address = newSug.find(
          s => s.resultType === 'houseNumber' || s.resultType === 'street'
        )
        if (address) {
          let newProfile = JSON.parse(JSON.stringify(this.user))
          newProfile.address = geoSuggestionToPlace(address)
          psStore.actions.updateProfile(newProfile)
        }
      }
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    get: get,
    set: set,
    findSelectedItem() {
      // find item in account config whose key equals the selected property
      for (const section in account_config) {
        const item = account_config[section].find(
          item => item.key === this.selectedProperty
        )
        if (item) {
          return item
        }
      }
      // should not happen (famous last words...)
      return undefined
    },
    onChangedInfoProperty(input) {
      // Fires when the user onfocusses the input
      // HACK: JSON parse/stringify to prevent "[vuex] do not mutate vuex store
      // state outside mutation handlers." error.
      let newProfile = JSON.parse(JSON.stringify(this.user))
      // check for parse function in account config
      const { parse } = this.findSelectedItem()
      if (parse) {
        // convert text input back to format that backend expects
        input = parse(input)
      }
      set(newProfile, this.selectedProperty, input)
      psStore.actions.updateProfile(newProfile)
      // Fetch geocode for address if different.
      if (!isEqual(this.user.address, newProfile.address)) {
        const query = this.addressQuery(newProfile.address)
        if (query) gsStore.actions.fetchGeocoderSuggestions({ query: query })
      }
    },
    addressQuery(address) {
      let query = ''
      // A locality is the minimum requirement.
      if (address['locality']) query = address['locality']
      else return query

      if (address['postalCode']) query = `${address['postalCode']}, ` + query
      if (address['street'] && address['houseNumber'])
        query = `${address['street']} ${address['houseNumber']}, ` + query
      else if (address['street']) query = `${address['street']}, ` + query

      return query
    },
  },
}
</script>

<style lang="scss" scoped>
.selected-property-column {
  padding: 0px;
  align-content: center;
  display: flex;
  flex-direction: row;
}

.change-property-input {
  align-self: center;

  .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
    > .v-input__control
    > .v-input__slot,
  .v-text-field.v-text-field--enclosed .v-text-field__details {
    padding: 0px;
    svg {
      height: 32px !important;
    }
  }
}
</style>
