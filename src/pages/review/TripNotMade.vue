<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col>
          <h3>Waarom niet ?</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-radio-group v-model="tripNotMadeReason" class="mt-1" column>
            <v-radio
              v-for="reason in tripNotMadeReasons"
              :key="reason.value"
              :label="reason.title"
              :value="reason.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            class="my-2"
            block
            rounded
            color="button"
            depressed
            @click="tripNotMade()"
          >
            Bevestig deze reis
          </v-btn>
          <v-btn
            block
            outlined
            rounded
            color="primary"
            @click="$emit('back', {})"
          >
            Terug
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import trip_not_made_config from '../../config/review/trip_not_made_config'

export default {
  name: 'TripNotMade',
  props: {
    trip: { type: Object, required: true },
  },
  data() {
    return {
      tripNotMadeReasons: trip_not_made_config,
      tripNotMadeReason: null,
    }
  },
  methods: {
    tripNotMade() {
      this.$emit('tripNotMade', { reason: this.tripNotMadeReason })
    },
  },
}
</script>

<style scoped></style>
