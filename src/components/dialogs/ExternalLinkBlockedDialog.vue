<template>
  <v-dialog v-model="dialogActive" @click:outside="$emit('close')">
    <v-card>
      <v-card-title>Verwijzing naar website </v-card-title>
      <v-card-text>
        <p>
          Vanwege een technisch probleem is het in deze versie nog niet mogelijk
          om rechtstreeks door te klikken naar deze website. We willen je
          vriendelijk vragen om onderstaande verwijzing te kopiëren en deze te
          plakken in adresregel van je browser app.
        </p>
        <p>
          <strong>{{ website }}</strong>
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
  name: 'ExternalLinkBlockedDialog',
  props: {
    showDialog: { type: Boolean, required: true },
    website: { type: String, required: true },
  },
  computed: {
    dialogActive() {
      return this.showDialog
    },
  },
}
</script>
