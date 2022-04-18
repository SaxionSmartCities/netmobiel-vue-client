<template>
  <content-pane scrollable @low="onLowWater">
    <v-row>
      <v-col>
        <h1 class="netmobiel">Goede Doelen</h1>
      </v-col>
    </v-row>
    <v-row v-if="canAdminCharities">
      <v-col>
        <v-btn
          color="primary"
          class="font-weight-bold"
          small
          rounded
          depressed
          outlined
          @click="newCharity"
        >
          Doel Toevoegen
        </v-btn>
      </v-col>
    </v-row>
    <!--    <v-row>-->
    <!--      <v-col class="">-->
    <!--        <v-text-field-->
    <!--          dense-->
    <!--          outlined-->
    <!--          label="Zoeken"-->
    <!--          hide-details-->
    <!--          prepend-inner-icon="search"-->
    <!--        ></v-text-field>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <v-row>
      <v-col>
        <h4 class="title text-color-primary mb-2">Overzicht</h4>
        <v-switch
          v-model="showClosedToo"
          label="Ook niet-actuele doelen"
        ></v-switch>
        <template v-for="charity in charities">
          <charity-card
            :key="charity.id"
            :charity="charity"
            :can-admin="canAdminCharities"
            class="my-2"
            @lookupCharity="onCharityLookup"
            @adminCharity="onCharityAdmin"
          />
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="charity-carousel-container">
        <h4 class="title text-color-primary mb-2">Eerder gedoneerd</h4>
        <v-carousel
          height="100%"
          hide-delimiter-background
          :continuous="false"
          light
        >
          <v-carousel-item
            v-for="charity in previouslyDonatedCharities"
            :key="charity.id"
          >
            <div class="cards-container">
              <charity-card
                :key="charity.id"
                class="charity-card"
                :charity="charity"
                @lookupCharity="onCharityLookup"
              />
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="netmobiel my-3">Top donateurs</h4>
        <v-divider />
        <top-donor-list :donors="topDonors"></top-donor-list>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as bsStore from '@/store/banker-service'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import CharityCard from '@/components/community/charity/CharityCard'
import TopDonorList from '@/components/community/charity/TopDonorList'

export default {
  name: 'CharityOverviewPage',
  components: { TopDonorList, CharityCard, ContentPane },
  data() {
    return {
      showClosedToo: false,
    }
  },
  computed: {
    charities() {
      return bsStore.getters.getCharities
    },
    previouslyDonatedCharities() {
      return bsStore.getters.getPreviouslyDonatedCharities
    },
    topDonors() {
      return bsStore.getters.getTopDonors
    },
    canAdminCharities() {
      return psStore.getters.canActAsTreasurer
    },
  },
  watch: {
    showClosedToo() {
      this.fetchCharities()
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    this.fetchCharities()
    bsStore.actions.fetchPreviouslyDonatedCharities()
    bsStore.actions.fetchTopDonors()
  },
  methods: {
    fetchCharities() {
      bsStore.actions.fetchCharities({
        closedToo: this.showClosedToo,
      })
    },
    onCharityLookup(charityId) {
      this.$router.push({
        name: 'charityDetailPage',
        params: { id: charityId },
      })
    },
    onCharityAdmin(charityId) {
      this.$router.push({
        name: 'editCharity',
        params: { charityId: charityId },
      })
    },
    newCharity() {
      this.$router.push({
        name: 'createCharity',
      })
    },
    onLowWater() {
      // console.log(`Add more content`)
    },
  },
}
</script>

<style lang="scss">
.charity-list {
  overflow: auto;
  white-space: nowrap;

  .charity-card {
    display: inline-block;
  }
}

.charity-carousel-container {
  .v-carousel {
    padding-bottom: 20px;
    .v-window__container {
      .v-window__prev,
      .v-window__next {
        margin: 0 !important;
      }
    }
  }
  .cards-container {
    padding: 8px 0 0 0;
    .charity-card {
      width: 92%;
      margin: auto;
      .v-card__actions {
        display: none;
      }
    }
  }
  .v-carousel__controls {
    z-index: 4;
    position: absolute;
    padding-top: 0 !important;
    padding-bottom: 20px !important;
    .v-btn--icon.v-size--small {
      height: 24px;
      width: 24px;
      svg {
        width: 50%;
        height: 50%;
      }
    }
  }
}

/**
makes sure that cards are aligned on small devices, but still show arrows(prev&next) on desktop
 */
@media (max-width: 767.98px) {
  .v-slide-group__prev {
    display: none !important;
  }
  .v-slide-group__next {
    display: none !important;
  }
}
</style>
