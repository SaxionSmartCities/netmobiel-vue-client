<template>
  <v-card class="rounded-border">
    <v-card-title>Hoe ga je Netmobiel gebruiken?</v-card-title>
    <v-card-text class="py-0">
      <v-radio-group v-model="userRole" :mandatory="false">
        <v-radio
          label="Passagier - Meerijden of via het OV"
          :value="passengerRole"
        ></v-radio>
        <v-radio
          label="Chauffeur - Zelf ritten aanbieden"
          :value="driverRole"
        ></v-radio>
        <v-radio
          label="Beide - Meerijden én zelf ritten aanbieden"
          :value="bothRole"
        >
        </v-radio>
      </v-radio-group>
    </v-card-text>
    <v-card-actions>
      <v-row no-gutters class="mb-2">
        <v-col xs6 class="mx-2">
          <v-btn block rounded outlined color="primary" @click="back()">
            <v-icon>arrow_back</v-icon>
            Terug
          </v-btn>
        </v-col>
        <v-col xs6 class="mx-2">
          <v-btn
            block
            rounded
            depressed
            color="button"
            :disabled="!userRole"
            @click="submitForm()"
          >
            Aanmaken
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import constants from '@/constants/constants'
export default {
  name: 'UserTypeCard',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // The constants should not be reactive
      passengerRole: Object.freeze(constants.PROFILE_ROLE_PASSENGER),
      driverRole: Object.freeze(constants.PROFILE_ROLE_DRIVER),
      bothRole: Object.freeze(constants.PROFILE_ROLE_BOTH),
      showSubmitButton: true,
      userRole: this.value,
    }
  },
  created() {
    // This does not seem to work
    // See https://stackoverflow.com/questions/42662144/how-could-i-use-const-in-vue-template
    // this.PROFILE_ROLE_PASSENGER = constants.PROFILE_ROLE_PASSENGER
    // this.PROFILE_ROLE_DRIVER = constants.PROFILE_ROLE_DRIVER
    // this.PROFILE_ROLE_BOTH = constants.PROFILE_ROLE_BOTH
  },
  methods: {
    submitForm() {
      this.$emit('update-role', this.userRole)
      this.$emit('next-step')
    },
    back() {
      this.$emit('prev-step')
    },
  },
}
</script>

<style scoped lang="scss"></style>
