<template>
  <content-pane>
    <span> Beoordeel jouw reis ?</span>
    <span>
      Hoe heb jij deze reis ervaren? Geef jouw mening en laat Henk weten wat jij
      er van vond
    </span>
    <v-row>
      <v-col>
        <v-btn-toggle v-model="compliments" multiple>
          <v-btn
            v-for="(compliment, index) in availableCompliments"
            :key="index"
            :value="compliment.value"
          >
            {{ compliment.title }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="$emit('sendFeedback', {})">Beoordeel deze reis</v-btn>
        <v-btn @click="$emit('back', {})">Terug</v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../components/common/ContentPane'
import trip_made_config from '../../config/review/trip_made_config'

export default {
  name: 'TripMade',
  components: { ContentPane },
  data() {
    return {
      availableCompliments: trip_made_config,
      compliments: [],
      feedbackMessage: '',
    }
  },
}
</script>

<style scoped></style>
