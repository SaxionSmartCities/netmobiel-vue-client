<template>
  <content-pane>
    <v-row>
      <v-col>
        <v-stepper v-model="step" :elevation="0">
          <v-stepper-header>
            <v-stepper-step step="1"></v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="2"></v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3"></v-stepper-step>
          </v-stepper-header>
        </v-stepper>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../components/common/ContentPane'
export default {
  name: 'DriverReviewPage',
  components: { ContentPane },
  props: {
    title: { type: String, required: true },
  },
  data() {
    return {
      step: 1,
    }
  },
}
</script>

<style scoped></style>
