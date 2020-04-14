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
                @click="changeInfo(item)"
              >
                <span>
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
    <change-info-modal
      v-if="showChangeInfoModal && selectedProperty"
      :show="showChangeInfoModal"
      :property-title="selectedProperty.title"
      @close="showChangeInfoModal = false"
    ></change-info-modal>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import account_config from '@/config/account_config'
import ChangeInfoModal from '@/components/profile/ChangeInfoModal'

export default {
  name: 'Account',
  components: { ChangeInfoModal, ContentPane },
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
      this.selectedProperty = item
      this.showChangeInfoModal = true
    },
  },
}
</script>

<style scoped></style>
