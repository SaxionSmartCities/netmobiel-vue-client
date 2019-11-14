<template>
  <v-container fluid fill-height class="background-primary">
    <v-row align="center" justify="center" class="pa-4">
      <v-col>
        <v-row>
          <v-col> <age-card /></v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="text-center">
            <a href="/" class="text-light-grey underlined">
              Hulp bij Netmobiel
            </a>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AgeCard from '@/components/onboarding/AgeCard.vue'

export default {
  components: {
    AgeCard,
  },
}
</script>

<style lang="scss"></style>
