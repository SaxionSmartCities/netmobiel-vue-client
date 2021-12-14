<template>
  <v-dialog v-model="dialogActive">
    <v-card>
      <v-card-title>
        {{ value.title }}
      </v-card-title>
      <v-card-text>
        {{ value.content }}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn outlined rounded color="primary" @click="done">
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
    value: { type: Object, default: () => undefined },
  },
  data() {
    return {
      dialogActive: false,
    }
  },
  methods: {
    done() {
      this.dialogActive = false
    },
  },
}
</script>
