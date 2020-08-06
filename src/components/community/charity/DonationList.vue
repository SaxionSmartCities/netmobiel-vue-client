<template>
  <v-row>
    <v-col>
      {{ donations }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DonationList',
  props: { donations: { type: Array, required: true } },
}
</script>

<style scoped></style>
