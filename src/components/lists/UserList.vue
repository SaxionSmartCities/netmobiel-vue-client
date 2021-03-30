<template>
  <generic-list :items="users" :empty-list-label="emptyListLabel">
    <template v-slot:list-item="{ item: user }">
      <v-row dense align="center">
        <v-col class="shrink pr-3">
          <round-user-image
            :profile-image="user.delegator.image"
            :image-size="50"
            :avatar-size="56"
          />
        </v-col>
        <v-col>
          <span class="body-1 font-weight-medium">
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
        <v-col class="shrink">
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
  },
}
</script>

<style scoped></style>
