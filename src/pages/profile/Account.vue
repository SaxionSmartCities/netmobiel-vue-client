<template>
  <content-pane>
    <v-row>
      <v-col>
        <span class="headline">Account</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        <div v-for="section in sections" :key="section">
          <span class="text-uppercase caption text-color-primary">
            {{ section }}
          </span>
          <v-divider></v-divider>
          <template v-for="(item, index) in accountConfig[section]">
            <v-row :key="item.title">
              <v-col cols="6">
                <span> {{ item.title }}</span>
              </v-col>
              <v-col cols="6">
                {{ user[item.key] }}
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

export default {
  name: 'Account',
  components: { ContentPane },
  data() {
    return {
      accountConfig: account_config,
    }
  },
  computed: {
    user() {
      return this.$store.getters['ps/getUser']
    },
    sections() {
      return Object.keys(account_config)
    },
  },
  created() {
    console.log('account config' + JSON.stringify(account_config, null, 2))
    console.log('keys', Object.keys(account_config))
  },
}
</script>

<style scoped></style>
