<template>
  <v-dialog v-model="showMe" max-width="400px">
    <v-card>
      <v-card-title class="headline">
        {{ propertyTitle }} Wijzigen.
      </v-card-title>

      <v-card-text class="my-2">
        <span>
          Geef hier uw nieuwe {{ propertyTitle.toLocaleLowerCase() }} op
        </span>
        <v-text-field
          v-model="newPropertyValue"
          hide-details
          outlined
        ></v-text-field>
      </v-card-text>

      <v-card-actions class="pr-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn color="primary-btn" text @click="showMe = false">
          close
        </v-btn>
        <v-btn color="primary" @click="save()">
          Opslaan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ChangeInfoModal',
  props: {
    show: {
      type: Boolean,
    },
    propertyTitle: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      newPropertyValue: null,
    }
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
    save() {
      console.log('new value: ', this.newPropertyValue)
      // this.$emit('select', user)
    },
  },
}
</script>

<style scoped></style>
