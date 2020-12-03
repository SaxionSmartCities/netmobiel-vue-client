<template>
  <v-dialog v-model="isVisible" persistent>
    <template v-slot:activator="{ on }"> </template>
    <v-card>
      <v-card-title class="headline">Annuleer deze oproep</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            Weet je zeker dat je deze oproep wilt annuleren? Dit kan niet
            ongedaan gemaakt worden.
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-btn
              large
              rounded
              block
              depressed
              color="button"
              @click="confirmCancellation"
            >
              Oproep annuleren
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-1">
            <v-btn
              large
              rounded
              outlined
              block
              depressed
              color="primary"
              @click="closeCancelDialog"
            >
              Oproep toch bewaren
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ShoutoutCancelDialog',
  components: {},
  props: {
    value: { type: Object, default: () => undefined },
  },
  computed: {
    isVisible() {
      return this.value?.isVisible || false
    },
  },
  methods: {
    confirmCancellation() {
      console.log('Confirm')
      this.$emit('onConfirm')
    },
    closeCancelDialog() {
      console.log('Close')
      this.$emit('onClose')
    },
  },
}
</script>
