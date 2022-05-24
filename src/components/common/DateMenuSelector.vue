<template>
  <div class="netmobiel-date-picker">
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
          v-model="displayDate"
          hide-details="auto"
          :prepend-icon="prependIcon"
          clearable
          readonly
          :outlined="outlined"
          :label="label"
          :rules="validationRules"
          @click:clear="clear"
          v-on="on"
        >
        </v-text-field>
      </template>
      <!-- The header date does not change with the selection, so no title -->
      <v-date-picker
        v-model="dateInternal"
        :active-picker.sync="activePicker"
        :title-date-format="titleDate"
        :max="maxDate"
        :min="minDate"
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
      default: undefined,
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
    max: {
      type: String,
      required: false,
      default: '',
    },
    min: {
      type: String,
      required: false,
      default: '1920-01-01',
    },
    startWithYear: {
      type: Boolean,
      required: false,
      default: false,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: function () {
    return {
      dateInternal: null,
      menu: false,
      activePicker: null,
      rules: {
        required: (value) => !!value || 'Verplicht veld',
      },
    }
  },
  computed: {
    validationRules() {
      let rules = []
      if (this.required) {
        rules.push(this.rules.required)
      }
      return rules
    },
    maxDate() {
      return this.dateValue(this.max)
    },
    minDate() {
      return this.dateValue(this.min)
    },
    displayDate: {
      get() {
        if (this.dateInternal) {
          return moment(this.dateInternal).locale('nl').format('D MMMM YYYY')
        }
        return undefined
      },
      set(value) {
        if (!value) {
          // The clear button is pressed, clear input
          this.dateInternal = value
        }
      },
    },
    todayIsoDate() {
      return moment().format('YYYY-MM-DD')
    },
  },
  watch: {
    value() {
      this.dateInternal = this.value
    },
    menu(val) {
      if (val) {
        if (this.startWithYear) {
          setTimeout(() => (this.activePicker = 'YEAR'))
        }
      }
    },
  },
  methods: {
    dateValue(text) {
      if (text === 'today') {
        return this.todayIsoDate
      } else {
        return text || ''
      }
    },
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
    clear() {
      this.menu = false
      this.$emit('date-selected', null)
    },
  },
}
</script>

<style lang="scss" scoped>
// To remove the small year header:
//.v-picker__title__btn.v-date-picker-title__year {
//  display: none;
//}
</style>
