<template>
  <content-pane class="pa-0">
    <public-profile-info v-if="profile" :profile="profile" />
    <highlighted-info
      :rides-driven="ridesDriven"
      :compliments-received="totalCompliments"
      :credits-donated="creditsDonated"
      class="mt-3"
    />
    <v-row class="mt-3">
      <v-col>
        <h4 class="netmobiel">Complimenten</h4>
      </v-col>
    </v-row>
    <compliments :compliments="refinedCompliments" />
    <v-row class="mt-3">
      <v-col>
        <h4 class="netmobiel">Beoordelingen</h4>
      </v-col>
    </v-row>
    <v-row v-if="reviews && reviews.length === 0">
      <v-col> Nog geen beoordelingen ontvangen. </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <review-item
          v-for="(review, index) in reviews"
          :key="index"
          :review="review"
          :profile-image="profileImages ? profileImages[index] : null"
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
  data() {
    return {
      profileImages: [],
    }
  },
  computed: {
    publicUser() {
      return psStore.getters.getPublicUsers.get(this.profileId)
    },
    profile() {
      return this.publicUser?.profile
    },
    compliments() {
      return this.publicUser?.compliments
    },
    reviews() {
      return this.publicUser?.reviews
    },
    ridesDriven() {
      // TODO: fetch from backend
      return 0
    },
    creditsDonated() {
      // TODO: fetch from backend
      return 0
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
  watch: {
    reviews(rvs) {
      this.profileImages = []
      rvs.forEach((review) => {
        psStore.actions
          .fetchPublicProfile({
            profileId: review.sender.id,
          })
          .then((res) => {
            this.profileImages.push(res.image)
          })
      })
    },
  },
  mounted() {
    psStore.actions.fetchPublicProfile({
      profileId: this.profileId,
    })
    psStore.actions.fetchUserCompliments({
      profileId: this.profileId,
    })
    psStore.actions.fetchUserReviews({
      profileId: this.profileId,
    })
  },
  created() {
    uiStore.mutations.showBackButton()
  },
}
</script>

<style lang="scss" scoped>
.reviews-container {
  max-height: 750px;
  overflow: auto;
}
</style>
