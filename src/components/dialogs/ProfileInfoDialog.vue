<template>
  <v-dialog v-model="dialogActive" @click:outside="$emit('close')">
    <v-card>
      <v-card-title>
        {{ dialog.title }}
      </v-card-title>
      <v-card-text>
        {{ dialog.content }}
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
  name: 'ProfileInfoDialog',
  props: {
    showDialog: { type: Boolean, required: true },
    dialog: { type: Object, required: true },
  },
  computed: {
    dialogActive() {
      return this.showDialog
    },
  },
}
</script>
