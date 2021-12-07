<template>
  <content-pane>
    <v-row dense>
      <v-col>
        In Netmobiel werken kennisinstellingen, technologiebedrijven, bewoners
        en overheden samen aan een mobiliteitsoplossing voor de Achterhoek in de
        de vorm van een app. Het is een innovatieproject dat gesubsidieerd wordt
        wordt door de Stichting Innovatie Alliantie, de Provincie Gelderland en
        Achterhoek ambassadeurs. Kijk op
        <a href="https://www.netmobiel.eu">onze website</a> voor meer
        informatie.
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        De software voor de Netmobiel app is ontwikkeld door het
        <a href="https://www.saxion.nl/onderzoek/smart-industry/smart-cities">
          Lectoraat Smart Cities</a
        >
        van de Saxion Hogeschool Enschede.
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as uiStore from '@/store/ui'

export default {
  name: 'AboutPage',
  components: { ContentPane },
  mounted() {
    uiStore.mutations.showBackButton()
  },
}
</script>

<style scoped></style>
