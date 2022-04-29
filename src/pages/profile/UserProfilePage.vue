<template>
  <content-pane>
    <public-profile-info v-if="profile" :profile="profile" />
    <v-row dense>
      <v-col>
        <highlighted-info
          :rides-driven="ridesDriven"
          :compliments-received="totalCompliments"
          :credits-donated="creditsDonated"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <h4 class="netmobiel">Complimenten</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <compliments :compliments="refinedCompliments" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="netmobiel">Beoordelingen</h4>
      </v-col>
    </v-row>
    <v-row v-if="!reviews || reviews.length === 0" dense>
      <v-col> Nog geen beoordelingen ontvangen. </v-col>
    </v-row>
    <v-row v-else dense>
      <v-col>
        <review-item
          v-for="(review, index) in reviews"
          :key="index"
          :review="review"
        />
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import PublicProfileInfo from '@/components/profile/PublicProfileInfo'
import Compliments from '@/components/profile/Compliments'
import ReviewItem from '@/components/profile/ReviewItem'
import HighlightedInfo from '@/components/profile/HighlightedInfo'
import * as psStore from '@/store/profile-service'
import * as uiStore from '@/store/ui'
import constants from '@/constants/constants'
import {
  encodeUrn,
  NETMOBIEL_CLASS,
  NETMOBIEL_SERVICE,
} from '@/utils/UrnHelper'
import * as isStore from '@/store/itinerary-service'
import * as bsStore from '@/store/banker-service'
import { emptyPage } from '@/store/storeHelper'

export default {
  name: 'UserProfilePage',
  components: {
    HighlightedInfo,
    ReviewItem,
    Compliments,
    PublicProfileInfo,
    ContentPane,
  },
  props: {
    profileId: { type: String, required: true },
  },
  computed: {
    publicUser() {
      return psStore.getters.getPublicUsers.get(this.profileId)
    },
    profile() {
      return this.publicUser?.profile
    },
    keycloakUrn() {
      return encodeUrn(
        NETMOBIEL_SERVICE.KEYCLOAK,
        NETMOBIEL_CLASS.USER,
        this.profileId
      )
    },
    compliments() {
      return this.publicUser?.compliments.data
    },
    reviews() {
      return this.publicUser?.reviews.data
    },
    userReport() {
      return isStore.getters.getSelectedUserReport
    },
    ridesDriven() {
      const asPassenger =
        this.userReport?.tripsAsPassenger.find(
          (mc) => mc.modality === 'RIDESHARE'
        )?.count ?? 0
      const asDriver =
        this.userReport?.tripsAsDriver.find((mc) => mc.modality === 'RIDESHARE')
          ?.count ?? 0
      return Math.max(asDriver, asPassenger)
    },
    creditsDonated() {
      return bsStore.getters.getTopDonors.totalCount > 0
        ? bsStore.getters.getTopDonors.data[0].donatedCredits
        : 0
    },
    refinedCompliments() {
      const result = {}
      for (const complimentCode of Object.keys(constants.COMPLIMENT_MAPPING)) {
        result[complimentCode] = 0
      }
      if (this.compliments) {
        for (const comp of this.compliments) {
          for (const type of comp.compliments) {
            result[type]++
          }
        }
      }
      return result
    },
    totalCompliments() {
      if (!this.refinedCompliments) {
        return 0
      }
      return Object.values(this.refinedCompliments)?.reduce(
        (acc, curr) => acc + curr
      )
    },
  },
  mounted() {
    psStore.actions.fetchPublicProfile({
      profileId: this.profileId,
    })
    psStore.actions.fetchUserCompliments({
      receiverId: this.profileId,
    })
    psStore.actions.fetchUserReviews({
      receiverId: this.profileId,
    })
    isStore.mutations.setSelectedUserReport(null)
    isStore.actions.fetchUserReport({
      profileRef: this.keycloakUrn,
    })
    bsStore.mutations.setTopDonors(emptyPage)
    bsStore.actions.fetchTopDonors({
      user: this.keycloakUrn,
      maxResults: 1,
    })
  },
  created() {
    uiStore.mutations.showBackButton()
  },
}
</script>

<style lang="scss" scoped></style>
