<template>
  <generic-list :items="users" :empty-list-label="emptyListLabel">
    <template v-slot:list-item="{ item: user }">
      <v-row dense>
        <v-col class="shrink pr-3">
          <round-user-image
            :profile-image="user.image"
            :image-size="50"
            :avatar-size="56"
          />
        </v-col>
        <v-col>
          <span class="body-1 font-weight-medium">Title {{ user }}</span>
          <br />
          <span class="body-2 grey--text">
            Sub
          </span>
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
        'Je hebt geen gebruikers voor wie je hun account beheerd.',
    }
  },
}
</script>

<style scoped></style>
