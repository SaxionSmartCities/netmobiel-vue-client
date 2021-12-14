<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
      :nudge-right="40"
    >
      <template #activator="{ on }">
        <v-text-field
          :value="displayDate"
          hide-details
          :prepend-icon="prependIcon"
          clearable
          readonly
          :outlined="outlined"
          :label="label"
          v-on="on"
        >
        </v-text-field>
      </template>
      <!-- The header date does not change with the selection, so no title -->
      <v-date-picker
        ref="picker"
        v-model="dateInternal"
        :title-date-format="titleDate"
        :max="todayIsoDate"
        min="1900-01-01"
        locale="nl-NL"
        no-title
        @change="save"
      ></v-date-picker>
    </v-menu>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  name: 'DateMenuSelector',
  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
    label: {
      type: String,
      required: false,
      default: '',
    },
    prependIcon: {
      type: String,
      required: false,
      default: '',
    },
    outlined: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: function () {
    return {
      dateInternal: null,
      menu: false,
    }
  },
  computed: {
    displayDate() {
      if (this.value) {
        return moment(this.value).locale('nl').format('D MMMM YYYY')
      }
      return undefined
    },
    todayIsoDate() {
      return moment().format('YYYY-MM-DD')
    },
  },
  watch: {
    menu(val) {
      if (val) {
        this.dateInternal = this.value
        this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
      }
    },
  },
  methods: {
    titleDate(val) {
      if (val) {
        return moment(val).locale('nl').format('D MMM YYYY')
      }
      return ''
    },
    save(date) {
      this.menu = false
      this.$emit('date-selected', date)
    },
  },
}
</script>

<style lang="scss">
// To remove the small year header:
//.v-picker__title__btn.v-date-picker-title__year {
//  display: none;
//}
</style>
