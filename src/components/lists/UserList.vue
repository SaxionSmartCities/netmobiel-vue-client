<template>
  <generic-list :items="users" :empty-list-label="emptyListLabel">
    <template #list-item="{ item: user }">
      <v-row dense align="center">
        <v-col class="shrink pr-3">
          <round-user-image
            :profile-image="user.delegator.image"
            :image-size="54"
            :avatar-size="60"
          />
        </v-col>
        <v-col>
          <span
            v-if="user.delegate === user.delegator"
            class="body-1 font-weight-medium"
          >
            Mijzelf
          </span>
          <span v-else class="body-1 font-weight-medium">
            {{
              user.delegator
                ? `${user.delegator.firstName} ${user.delegator.lastName}`
                : 'Onbekend'
            }}
          </span>
          <br />
          <span class="body-2 grey--text">
            Woonplaats
            {{ user.delegator ? user.delegator.address.locality : 'Onbekend' }}
          </span>
        </v-col>
        <v-col v-if="user.delegate !== user.delegator" class="shrink">
          <v-icon :disabled="!!selectedId" @click="deleteDeletation(user)">
            delete
          </v-icon>
        </v-col>
        <v-col
          v-if="
            selectedId === user.delegator.id ||
            (!selectedId && user.delegate === user.delegator)
          "
          class="shrink"
        >
          <v-icon large class="secondary-color"> check </v-icon>
        </v-col>
        <v-col v-else class="shrink">
          <v-icon large @click="switchAccount(user.delegator.id)">
            chevron_right
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
  name: 'UserList',
  components: { RoundUserImage, GenericList },
  props: {
    users: { type: Array, required: true },
    selectedId: { type: String, default: null },
  },
  data() {
    return {
      emptyListLabel:
        'Je beheert op dit moment geen accounts van andere gebruikers.',
    }
  },
  methods: {
    switchAccount(userId) {
      this.$emit('AccountSelected', userId)
    },
    deleteDeletation(delegation) {
      this.$emit('DelegationDelete', delegation.id)
    },
  },
}
</script>

<style lang="scss" scoped>
.secondary-color {
  color: $color-orange !important;
}
</style>
