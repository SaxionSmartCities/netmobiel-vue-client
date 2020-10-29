<template>
  <content-pane class="pa-0">
    <public-profile-info :profile="profile" />
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
      <v-col>
        Nog geen beoordelingen ontvangen.
      </v-col>
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
import config from '@/config/config'
import Compliments from '@/components/profile/Compliments'
import ReviewItem from '@/components/profile/ReviewItem'
import HighlightedInfo from '@/components/profile/HighlightedInfo'
import * as psStore from '@/store/profile-service'
import * as uiStore from '@/store/ui'

export default {
  name: 'UserProfile',
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
    profile() {
      return psStore.getters.getExternalUser.profile
    },
    compliments() {
      return psStore.getters.getExternalUser.compliments
    },
    reviews() {
      return psStore.getters.getExternalUser.reviews
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
      if (this.compliments) {
        for (const comp of this.compliments) {
          if (!result[comp.complimentType]) {
            result[comp.complimentType] = 1
          } else {
            result[comp.complimentType]++
          }
        }
      }
      return result
    },
    totalCompliments() {
      if (Object.values([]).length === 0) {
        return 0
      }
      return Object.values(this.refinedCompliments)?.reduce(
        (acc, curr) => acc + curr
      )
    },
  },
  mounted() {
    psStore.actions.fetchUserProfile({
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
  methods: {
    fetchProfileImages() {
      this.reviews.forEach(review => {
        psStore.actions
          .fetchUserProfile({
            profileId: review.sender.id,
          })
          .then(res => {
            this.profileImages.push(config.BASE_URL + res.image)
          })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.reviews-container {
  max-height: 750px;
  overflow: auto;
}
</style>
