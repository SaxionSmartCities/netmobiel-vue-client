<template>
  <v-dialog v-model="dialogActive" @click:outside="$emit('close')">
    <v-card>
      <v-card-title>Afbeelding aanpassen </v-card-title>
      <v-card-text>
        <p>
          Vanwege een technisch probleem is het in deze versie helaas niet
          mogelijk om de afbeelding aan te passen. We hopen dat we het probleem
          spoedig kunnen verhelpen.
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn outlined rounded color="primary" @click="$emit('close')">
          <span class="px-2">Sluiten</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'UpdateImageIssueDialog',
  props: {
    showDialog: { type: Boolean, required: true },
  },
  computed: {
    dialogActive() {
      return this.showDialog
    },
  },
}
</script>
