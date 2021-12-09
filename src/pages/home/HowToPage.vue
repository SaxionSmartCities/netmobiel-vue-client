<template>
  <content-pane>
    <template #header>
      <tab-bar
        v-if="showTabs"
        class="shrink"
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template #firstTab>
          <v-icon color="white">commute</v-icon>
          <span> Passagier </span>
        </template>
        <template #secondTab>
          <v-icon color="white">directions_car</v-icon>
          <span> Chauffeur </span>
        </template>
      </tab-bar>
    </template>
    <v-row v-if="(showTabs && selectedTab === 0) || isPassenger" dense>
      <v-col>
        <slide-show-how-to :items="itemsPassenger" />
      </v-col>
    </v-row>
    <v-row v-if="(showTabs && selectedTab === 1) || isDriver" dense>
      <v-col>
        <slide-show-how-to :items="itemsDriver" />
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import SlideShowHowTo from '@/components/other/SlideShowHowTo.vue'
import TabBar from '@/components/common/TabBar'
import constants from '../../constants/constants'
import * as psStore from '@/store/profile-service'
import * as uiStore from '@/store/ui'

export default {
  components: {
    ContentPane,
    SlideShowHowTo,
    TabBar,
  },
  data() {
    return {
      selectedTab: 0,
      itemsPassenger: [
        {
          icon: 'ht-credits.png',
          title: 'Schaf credits aan',
          description:
            'Je betaalt voor je ritten met credits. Goed nieuws, je eerste paar ritten zijn op onze kosten.',
          action: {
            label: 'Koop credits',
            onclick: () => this.$router.push('/addCredits'),
          },
        },
        {
          icon: 'ht-search.png',
          title: 'Zoeken naar ritten',
          description:
            'Waar wil je heen? Om welke tijd? En met welke wensen? Voer het in en zoek naar een geschikte rit.',
          action: {
            label: 'Rit zoeken',
            onclick: () => this.$router.push('/search'),
          },
        },
        {
          icon: 'ht-travel.png',
          title: 'Boek je rit',
          description:
            'Bekijk het aanbod en boek een rit. Je kan hierbij gebruikmaken van verschillende vervoersopties zoals met iemand meerijden of het openbaar vervoer.',
        },
        {
          icon: 'ht-booking.png',
          title: 'Leg je rit af',
          description:
            'Reis met de trein of bus en/of rij met een dorpsbewoner mee.',
        },
        {
          icon: 'ht-review.png',
          title: 'Betaal en beoordeel',
          description:
            'Betaal jouw rit en laat een beoordeling achter voor de chauffeur.',
        },
        {
          icon: 'ht-question.png',
          title: 'Meer info?',
          description: 'Bezoek onze website voor aanvullende informatie.',
          action: {
            label: 'Bezoek website',
            onclick: () => window.open('https://www.netmobiel.eu/', '_blank'),
          },
        },
      ],
      itemsDriver: [
        {
          icon: 'ht-offer.png',
          title: 'Bied een rit aan',
          description:
            'Heb je een reis gepland en nog een plekje in de auto? Bied je rit aan en help daarmee dorpsbewoners.',
          action: {
            label: 'Rit aanbieden',
            onclick: () => this.$router.push('/plan'),
          },
        },
        {
          icon: 'ht-shoutout.png',
          title: 'Reageer op ritverzoeken',
          description:
            'Iemand wil met je meerijden. Bekijk het ritverzoek en bepaal of je hem accepteert.',
          action: {
            label: 'Bekijk ritverzoeken',
            onclick: () => this.$router.push('/shoutouts'),
          },
        },
        {
          icon: 'ht-ride.png',
          title: 'Leg je reis af',
          description:
            'Haal je passagier op, zet hem af op zijn eindbestemming en verdien credits.',
        },
        {
          icon: 'ht-credits.png',
          title: 'Betaal je credits uit',
          description:
            'Je kan kiezen om je credits uit te keren in geld maar je kan ze ook doneren aan een goed doel.',
          action: {
            label: 'Bekijk goede doelen',
            onclick: () => this.$router.push('/charityOverviewPage'),
          },
        },
        {
          icon: 'ht-question.png',
          title: 'Meer info?',
          description: 'Bezoek onze website voor aanvullende informatie.',
          action: {
            label: 'Bezoek website',
            onclick: () => window.open('https://www.netmobiel.eu/', '_blank'),
          },
        },
      ],
    }
  },
  computed: {
    showTabs() {
      const role = psStore.getters.getProfile.userRole
      return !role || role === constants.PROFILE_ROLE_BOTH
    },
    isPassenger() {
      const role = psStore.getters.getProfile.userRole
      return role === constants.PROFILE_ROLE_PASSENGER
    },
    isDriver() {
      const role = psStore.getters.getProfile.userRole
      return role === constants.PROFILE_ROLE_DRIVER
    },
  },
  mounted() {
    uiStore.mutations.showBackButton()
  },
}
</script>

<style lang="scss"></style>
