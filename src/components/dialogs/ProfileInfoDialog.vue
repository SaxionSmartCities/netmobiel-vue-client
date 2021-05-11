<template>
  <v-dialog v-model="value.isVisible">
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
  methods: {
    done() {
      this.value.isVisible = false
    },
  },
}
</script>
