<template>
  <content-pane>
    <v-row dense>
      <v-col><h1>Over deze app</h1></v-col>
    </v-row>
    <v-row dense>
      <v-col>
        In Netmobiel werken kennisinstellingen, technologiebedrijven, bewoners
        en overheden samen aan een mobiliteitsoplossing voor de Achterhoek in de
        de vorm van een app. Het is een innovatieproject dat gesubsidieerd wordt
        wordt door de Stichting Innovatie Alliantie, de Provincie Gelderland en
        Achterhoek ambassadeurs. Kijk op
        <external-link
          href="https://www.netmobiel.eu"
          @link-disabled="onBlockedLink"
        >
          <template #anchorBody><strong>onze website</strong></template>
        </external-link>
        voor meer informatie.
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        De software voor de Netmobiel app is ontwikkeld door het
        <external-link
          href="https://www.saxion.nl/onderzoek/smart-industry/smart-cities"
          @link-disabled="onBlockedLink"
        >
          <template #anchorBody
            ><strong>Lectoraat Smart Cities</strong></template
          >
        </external-link>
        van de Saxion Hogeschool Enschede.
      </v-col>
    </v-row>
    <external-link-blocked-dialog
      :website="website"
      :show-dialog="dialogIsVisible"
      @close="dialogIsVisible = false"
    />
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as uiStore from '@/store/ui'
import ExternalLinkBlockedDialog from '@/components/dialogs/ExternalLinkBlockedDialog'
import ExternalLink from '@/components/common/ExternalLink'

export default {
  name: 'AboutPage',
  components: { ExternalLink, ContentPane, ExternalLinkBlockedDialog },
  data() {
    return {
      dialogIsVisible: false,
      website: '',
    }
  },
  mounted() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    onBlockedLink(link) {
      this.website = link
      this.dialogIsVisible = true
    },
  },
}
</script>

<style scoped></style>
