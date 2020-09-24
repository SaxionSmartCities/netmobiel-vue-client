<template>
  <content-pane>
    <public-profile-info :profile="profile" />
    <v-row class="mt-2">
      <v-col>
        <highlighted-info
          v-if="totalCompliments"
          :compliments-received="totalCompliments"
        ></highlighted-info>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col>
        <span class="text-color-primary caption text-uppercase">
          Complimenten
        </span>
        <compliments
          v-if="compliments"
          class="mt-2"
          :compliments="refinedCompliments"
        ></compliments>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col>
        <span class="text-color-primary caption text-uppercase">
          Reviews
        </span>
        <div class="reviews-container mt-1">
          <review-item
            v-for="(review, index) in reviews"
            :key="index"
            :review="review"
            :profile-image="profileImages ? profileImages[index] : null"
          >
          </review-item>
        </div>
        <v-btn class="float-right" color="primary" rounded outlined small>
          Bekijk alle reviews
        </v-btn>
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
      user: {},
      compliments: null,
      reviews: null,
      profileImages: [],
    }
  },
  computed: {
    profile() {
      return this.user
    },
    refinedCompliments() {
      const result = {}
      for (const comp of this.compliments) {
        if (!result[comp.complimentType]) {
          result[comp.complimentType] = 1
        } else {
          result[comp.complimentType]++
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
    this.fetchProfilePageInformation()
  },
  methods: {
    userProfileImage() {
      if (this.user.image) return config.BASE_URL + this.user.image
      else return null
    },
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
    fetchProfilePageInformation() {
      //Fetch profile of user
      psStore.actions
        .fetchUserProfile({
          profileId: this.profileId,
        })
        .then(res => {
          this.user = res
        })
      //Fetch compliments of user
      psStore.actions
        .fetchUserCompliments({
          profileId: this.profileId,
        })
        .then(res => {
          this.compliments = res.compliments
        })
      //Fetch reviews of user
      psStore.actions
        .fetchUserReviews({ profileId: this.profileId })
        .then(res => {
          this.reviews = res
          this.fetchProfileImages()
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
