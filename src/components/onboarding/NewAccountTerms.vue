<template>
  <v-card class="rounded-border">
    <v-card-title>Algemene voorwaarden</v-card-title>
    <v-card-text class="py-0">
      <v-form ref="form" v-model="valid">
        <v-row vertical-align-center>
          <v-col>
            <p>
              In het innovatieproject Netmobiel werken bewoners van de
              Achterhoek, kennisinstellingen en de regio Achterhoek samen aan
              worden personen die vervoer zoeken gekoppeld aan personen die een
              een slimme mobiliteitsoplossing voor de Achterhoek te. Via de app
              plek over hebben in de auto en/of aan openbaarvervoersopties. De
              app heeft het doel om de bereikbaarheid in de Achterhoek te
              verbeteren. In de eerste maanden wordt er onderzoek gedaan naar de
              effecten van de app, onder andere door Hogeschool Saxion.
            </p>
            <p>
              Binnen het project Netmobiel heeft Hogeschool Saxion de app
              ontwikkeld. Ook zorgt Saxion voor de onderhoudt van de app.
              Vereniging Netmobiel, een vereniging door en voor Achterhoekers,
              is daarnaast verantwoordelijk voor de uitbetalingen. Denk hierbij
              aan de vergoeding die je kunt krijgen als je een rit aanbiedt. Ook
              stelt Vereniging Netmobiel bepaalde gedragsregels op om het reizen
              met Netmobiel voor zowel reiziger als passagier veilig en
              comfortabel te houden. In dat kader is het verplicht om lid te
              worden van Vereniging Netmobiel, voordat je gebruik kunt maken van
              de Netmobiel-app.
            </p>

            <p>
              Nadere informatie over de verwerking van persoonsgegevens binnen
              project Netmobiel door Vereniging Netmobiel en Stichting Saxion is
              terug te vinden in de
              <a
                href="https://www.netmobiel.eu/privacyverklaring-app/"
                target="_blank"
                >privacyverklaring</a
              >.
            </p>
          </v-col>
        </v-row>
        <v-row no-gutters align="center">
          <v-col cols="1">
            <v-checkbox
              v-model="value.consent.acceptedTerms"
              :rules="[rules.required]"
            ></v-checkbox>
          </v-col>
          <v-col cols="11">
            Ik ga hierbij akkoord met het reglement van Vereniging Netmobiel en
            de ‘Code Goed Gedrag’ die gelden bij het gebruik van de
            Netmobiel-app. Ik verklaar daarnaast kennis te hebben genomen van de
            <a
              href="https://www.netmobiel.eu/privacyverklaring-app/"
              target="_blank"
              >privacyverklaring</a
            >
            en geef toestemming voor de verwerking van mijn persoonsgegevens.
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-row no-gutters class="mb-2">
        <v-col xs6 class="mx-2">
          <v-btn block text @click="back()">
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
            :disabled="!valid"
            @click="submitForm()"
          >
            Verder
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'NewAccountTerms',
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      valid: false,
      rules: {
        required: value => !!value || '',
      },
    }
  },
  methods: {
    submitForm() {
      // Only show consent error after the user has clicked on submit.
      this.validate()
      if (this.valid) {
        this.$emit('next-step')
      }
    },
    back() {
      this.$emit('prev-step')
    },
    validate() {
      this.$nextTick(() => {
        const isValid = this.$refs.form.validate()
        this.$emit('onFormValid', isValid)
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
