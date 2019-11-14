<template>
  <v-card class="rounded-border">
    <v-card-title>Even voorstellen!</v-card-title>
    <v-card-text class="py-0">
      <v-row no-gutters>
        <v-col>
          <span class="text-uppercase text-color-primary ">
            Wanneer ben je jarig?
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                hide-details
                dense
                :value="displayDate"
                prepend-icon="event"
                readonly
                v-on="on"
              >
              </v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="date"
              :max="new Date().toISOString().substr(0, 10)"
              min="1950-01-01"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col xs6 class="mx-2">
          <v-btn block rounded outlined @click="skipStep()">Overslaan</v-btn>
        </v-col>
        <v-col xs6 class="mx-2">
          <v-btn block rounded color="button" @click="nextStep()">Verder</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment'

export default {
  data: function() {
    return {
      date: new Date().toISOString().substr(0, 10),
      menu: false,
    }
  },
  computed: {
    displayDate: function() {
      return moment(this.date).format('DD-MM-YYYY')
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  methods: {
    skipStep: function() {
      console.log('skip')
    },
    nextStep: function() {
      console.log('next')
      let profile = this.$store.getters['ps/getProfile']
      profile['age'] = this.age

      this.$store.dispatch('ps/updateProfile', profile)
    },
  },
}
</script>

<style lang="scss"></style>
