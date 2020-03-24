<template>
  <v-dialog v-model="show" max-width="400px">
    <v-card>
      <v-card-title class="headline">
        Which driver do you want to send a message?
      </v-card-title>

      <v-card-text class="mt-2">
        <span @click="userClick(user)" v-for="user in users" :key="user.id">
          {{ user.name }}
        </span>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary-btn" text @click="show = false">
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ContactDriverModal',
  props: {
    showMe: {
      type: Boolean,
    },
    users: {
      type: Array,
    },
  },
  computed: {
    show: {
      get() {
        return this.showMe
      },
      set(newValue) {
        this.$emit('close', newValue)
      },
    },
  },
  methods: {
    userClick(user) {
      this.$emit('select', user)
    },
  },
}
</script>

<style scoped></style>
