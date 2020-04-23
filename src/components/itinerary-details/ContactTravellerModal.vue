<template>
  <v-dialog v-model="showMe" max-width="400px">
    <v-card>
      <v-card-title class="headline">
        Which traveller do you want <br />
        to send a message?
      </v-card-title>

      <v-card-text class="mt-2">
        <p v-for="user in users" :key="user.id" @click="userClick(user)">
          {{ user.name }}
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary-btn" text @click="showMe = false">
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ContactTravellerModal',
  props: {
    show: {
      type: Boolean,
    },
    users: {
      type: Array,
    },
  },
  computed: {
    showMe: {
      get() {
        return this.show
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
