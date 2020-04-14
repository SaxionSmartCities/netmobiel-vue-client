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
                <span class="align-self-center body-2"> {{ item.title }}</span>
              </v-col>
              <v-col
                cols="6"
                class="body-2 font-weight-thin"
                :class="{
                  'selected-property-column': selectedProperty === item.key,
                }"
                @click="selectedProperty = item.key"
              >
                <v-text-field
                  v-if="selectedProperty === item.key"
                  class="change-property-input"
                  :value="
                    item.format ? item.format(user[item.key]) : user[item.key]
                  "
                  solo
                  autofocus
                  flat
                  single-line
                  clearable
                  hide-details
                  @input="onChangedInfoProperty"
                >
                </v-text-field>
                <span v-else>
                  {{
                    item.format ? item.format(user[item.key]) : user[item.key]
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
    <!--    <change-info-modal-->
    <!--      v-if="showChangeInfoModal && selectedProperty"-->
    <!--      :show="showChangeInfoModal"-->
    <!--      :property-title="selectedProperty.title"-->
    <!--      @close="showChangeInfoModal = false"-->
    <!--    ></change-info-modal>-->
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import account_config from '@/config/account_config'

export default {
  name: 'Account',
  components: { ContentPane },
  data() {
    return {
      accountConfig: account_config,
      showChangeInfoModal: false,
      selectedProperty: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['ps/getUser'].profile
    },
    sections() {
      return Object.keys(account_config)
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    changeInfo(item) {
      console.log(item)
    },
    onChangedInfoProperty(event) {
      console.log('Changed info property', event)
    },
  },
}
</script>

<style lang="scss" scoped>
.selected-property-column {
  padding: 0px;
  align-content: center;
  border: 1px solid red;
  display: flex;
  flex-direction: row;
}
.change-property-input {
  align-self: center;
  .v-icon.v-icon.v-icon--link {
  }
  .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
    > .v-input__control
    > .v-input__slot,
  .v-text-field.v-text-field--enclosed .v-text-field__details {
    padding: 0px;
    svg {
      height: 24px !important;
    }
  }
}
</style>
