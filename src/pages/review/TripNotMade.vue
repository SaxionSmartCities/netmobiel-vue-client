<template>
  <content-pane>
    <v-row>
      <v-col class="pt-0 px-0">
        <h3>Waarom niet ?</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0">
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
      <v-col class="px-0">
        <v-btn class="my-2" block rounded color="button" @click="tripNotMade()">
          Beoordeel deze reis
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
  </content-pane>
</template>

<script>
import ContentPane from '../../components/common/ContentPane'
import trip_not_made_config from '../../config/review/trip_not_made_config'
export default {
  name: 'TripNotMade',
  components: { ContentPane },
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
