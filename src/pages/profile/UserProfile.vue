<template>
  <content-pane>
    <v-row v-if="user">
      <v-col class="shrink">
        <round-user-image
          :profile-image="userProfileImage()"
          :image-size="100"
          :avatar-size="105"
        ></round-user-image>
      </v-col>
      <v-col>
        <div class="d-flex flex-column shrink">
          <span class="title">
            {{ user.firstName + ' ' + user.lastName }}
          </span>
          <span class="body-1">{{ user.address.locality }}</span>
        </div>
        <div class="d-flex flex-column mt-3">
          <span class="subtitle-1">35-40 jaar</span>
          <span class="subtitle-1">
            Houdt van: {{ user.interests.join(', ') }}
          </span>
        </div>
        <v-btn depressed color="button" rounded class="mt-2" small>
          <v-icon>add</v-icon>
          Toevoegen als vriend
        </v-btn>
      </v-col>
    </v-row>
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
import RoundUserImage from '@/components/common/RoundUserImage'
import config from '@/config/config'
import Compliments from '@/components/profile/Compliments'
import ReviewItem from '@/components/profile/ReviewItem'
import HighlightedInfo from '@/components/profile/HighlightedInfo'

export default {
  name: 'UserProfile',
  components: {
    HighlightedInfo,
    ReviewItem,
    Compliments,
    RoundUserImage,
    ContentPane,
  },
  props: {
    profileId: { type: String, required: true },
  },
  data() {
    return {
      user: null,
      compliments: null,
      reviews: null,
      profileImages: [],
    }
  },
  computed: {
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
        this.$store
          .dispatch('ps/fetchUserProfile', {
            profileId: review.sender.id,
          })
          .then(res => {
            this.profileImages.push(config.BASE_URL + res.image)
          })
      })
    },
    fetchProfilePageInformation() {
      //Fetch profile of user
      this.$store
        .dispatch('ps/fetchUserProfile', {
          profileId: this.profileId,
        })
        .then(res => {
          this.user = res
        })
      //Fetch compliments of user
      this.$store
        .dispatch('ps/fetchUserCompliments', {
          profileId: this.profileId,
        })
        .then(res => {
          this.compliments = res.compliments
        })
      //Fetch reviews of user
      this.$store
        .dispatch('ps/fetchUserReviews', { profileId: this.profileId })
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
