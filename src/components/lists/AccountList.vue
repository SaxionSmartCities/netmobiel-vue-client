<template>
  <generic-list :items="accounts" :empty-list-label="emptyListLabel">
    <template v-slot:list-item="{ item: account }">
      <v-row dense align="center">
        <v-col class="shrink pr-3">
          <round-user-image
            :profile-image="account.image"
            :image-size="50"
            :avatar-size="56"
          />
        </v-col>
        <v-col>
          <span class="body-1 font-weight-medium">
            {{ `${account.firstName} ${account.lastName}` }}
          </span>
          <br />
          <span class="body-2 grey--text">
            Woonplaats
            {{ account.address ? account.address.locality : 'Onbekend' }}
          </span>
        </v-col>
        <v-col class="shrink">
          <v-icon large>
            add_circle_outline
          </v-icon>
        </v-col>
      </v-row>
    </template>
  </generic-list>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import GenericList from './GenericList.vue'

export default {
  name: 'AccountList',
  components: { RoundUserImage, GenericList },
  props: {
    accounts: { type: Array, required: true },
    emptyListLabel: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
.secondary-color {
  color: $color-orange !important;
}
</style>
