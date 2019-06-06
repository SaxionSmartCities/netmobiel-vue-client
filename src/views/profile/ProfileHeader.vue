<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <v-avatar :size="size" id="profileImage">
          <img :src="avatar" />
        </v-avatar>
      </v-flex>
      <v-layout class="mt-2">
        <v-flex>
          <p class="ma-0">{{ getUserData().fullName }}</p>
          <p class="ma-0">{{ address }}</p>
          <v-layout row>
            <v-flex v-for="i in getStars" xs1>
              <v-icon small color="yellow">star</v-icon>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'ProfileHeader',
  data() {
    return {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      size: 70,
      address: 'Gasthuisstraat 9, Bredevoort',
    }
  },
  methods: {
    getUserData() {
      return this.$store.getters.getUser
    },
  },
  computed: {
    getStars() {
      return 3
    },
  },
}
</script>

<style lang="scss">
</style>
