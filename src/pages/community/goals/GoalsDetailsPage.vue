<template>
  <content-pane>
    <v-row align="center" justify="center">
      <v-img
        src="../../../../src/assets/achterhoek_background.jpg"
        lazy-src="https://picsum.photos/id/11/100/60"
        aspect-ratio="1"
        class="grey lighten-2"
        max-width="500"
        max-height="300"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-row>
    <v-row>
      <span class="title pt-4">
        Renovatie St. Bonifatiuskerk
      </span>
    </v-row>
    <v-row class="mb-4">
      <span class="overline">Lichtenvoorde</span>
    </v-row>
    <v-row>
      <span>
        De Sint-Bonifatiuskerk is een rooms-katholieke kerk in Lichtenvoorde,
        gebouwd in de jaren 1912 en 1913. De architect was WOlter te Riele, die
        een negotisch
      </span>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-row>
          <v-col cols="12">
            <v-progress-circular
              :rotate="-90"
              :size="100"
              :width="11"
              :value="100"
              color="primary"
            >
              {{ nrOfDonors }}
            </v-progress-circular>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span>Donateurs</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-col cols="12">
            <v-progress-circular
              :rotate="-90"
              :size="100"
              :width="11"
              :value="77"
              color="primary"
            >
              {{ donatedCredits }}
              <br />
              {{ prefix }}
            </v-progress-circular>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span>Gedoneerd</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-col cols="12">
            <v-progress-circular
              :rotate="-90"
              :size="100"
              :width="11"
              :value="75"
              color="primary"
            >
              {{ percentageAchievedOfGoal }}
            </v-progress-circular>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span>Behaald</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-btn large rounded block mb-4 depressed color="button">
        Steun dit doel
      </v-btn>
    </v-row>
    <v-container>
      <v-row mb-3 mt-3>
        <span class="font-weight-medium primary--text">Top donateurs</span>
      </v-row>
      <v-row>
        <v-divider />
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-list-item-avatar tilesize="100" color="grey"></v-list-item-avatar>
        </v-col>
        <v-col>
          <v-row>
            <span class="subtitle-2 text-no-wrap pr-2"
              >Hendrik van der laan
            </span>
          </v-row>
          <v-row>
            <span class="overline">793 credits gedoneerd</span>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-divider />
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-list-item-avatar tilesize="100" color="grey"></v-list-item-avatar>
        </v-col>
        <v-col>
          <v-row>
            <span class="subtitle-2 text-no-wrap pr-2">Marc de Vries </span>
          </v-row>
          <v-row>
            <span class="overline">323 credits gedoneerd</span>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-divider />
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-list-item-avatar tilesize="100" color="grey"></v-list-item-avatar>
        </v-col>
        <v-col>
          <v-row>
            <span class="subtitle-2 text-no-wrap pr-2">Coby Hoekstra </span>
          </v-row>
          <v-row>
            <span class="overline">{{ fetchGoals() }}</span>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </content-pane>
</template>

<script>
import ContentPane from '../../../components/common/ContentPane'
export default {
  name: 'GoalsDetailsPage',
  components: { ContentPane },
  data() {
    return {
      nrOfDonors: 30,
      donatedCredits: 230,
      prefix: 'credits',
      percentageAchievedOfGoal: '65%',
    }
  },
  methods: {
    fetchGoals() {
      return this.$store.getters['sg/fetchGoals']
    },
  },
}
</script>

<style scoped></style>
