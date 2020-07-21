<template>
  <content-pane>
    <v-row>
      <v-col>
        <h2>Veilig reizen met Netmobiel</h2>
        <section class="mt-4">
          <h3>
            Tijdens het boeken
          </h3>
          <p class="body-1">
            Als je een rit aanbiedt of zoekt, moet je aangeven of jij en anderen
            in je huishouden gezond zijn. Je kunt geen reizen zoeken of ritten
            aanbieden als je coronaklachten hebt of anderen in je huishouden de
            laatste twee weken corona hebben gehad.
          </p>
        </section>
        <section class="mt-4">
          <h3>
            Vijf tips voor tijdens de reis
          </h3>
          <ol class="body-1">
            <li>
              Gebruik net als in het openbaar vervoer een mondkapje. Dit is
              echter niet verplicht.
            </li>
            <li>Was je handen voor je de auto in gaat.</li>
            <li>
              Maak als chauffeur het dashboard, de portier en andere plekken die
              passagiers mogelijk hebben aangeraakt voor en na de rit schoon.
            </li>
            <li>
              Zet de airco en luchtventillatie uit. Doe waar nodig een raampje
              open.
            </li>
            <li>
              Om toch zoveel mogelijk afstand te houden kan de passagier
              achterin plaatsnemen.
            </li>
          </ol>
        </section>
        <section class="mt-4">
          <h3>Na de reis of rit</h3>
          <p class="body-1">
            Krijg je na de reis of rit corona-achtige klachten? Stuur dan je
            passagier of chauffeur dan meteen een bericht via de app, zodat
            hij/zij zich kan laten testen. Doe dit zelfs als je slechts milde
            klachten hebt!
          </p>
        </section>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
export default {
  name: 'RideSafeNetmobiel',
  components: { ContentPane },
  mounted() {
    this.$store.commit('ui/showBackButton')
  },
}
</script>

<style lang="scss" scoped></style>
