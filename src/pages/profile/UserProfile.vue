<template>
  <content-pane>
    <v-row>
      <v-col class="shrink">
        <round-user-image
          :profile-image="userProfileImage()"
          :image-size="100"
          :avatar-size="105"
        ></round-user-image>
      </v-col>
      <v-col>
        <div class="d-flex flex-column">
          <span class="headline">{{
            user.firstName + ' ' + user.lastName
          }}</span>
          <span class="body-1">{{ 'Aalten' }}</span>
        </div>
        <div class="d-flex flex-column mt-5">
          <span class="subtitle-1">35-40 jaar</span>
          <span class="subtitle-1">Houdt van: lezen, reizen</span>
        </div>
        <v-btn depressed color="button" rounded class="mt-4" small>
          <v-icon>add</v-icon>
          Toevoegen als vriend
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="user-info-highlight">
          <div class="d-flex flex-column">
            <span class="text-color-primary">
              205
            </span>
            <span>
              Ritten <br />
              gereden
            </span>
          </div>
          <div class="d-flex flex-column text-center">
            <span class="text-color-primary">
              189
            </span>
            <span>
              Complimenten <br />
              gekregen
            </span>
          </div>
          <div class="d-flex flex-column text-center">
            <span class="text-color-primary">
              169
            </span>
            <span>
              Credits <br />
              gedoneerd
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import RoundUserImage from '@/components/common/RoundUserImage'
import config from '@/config/config'

export default {
  name: 'UserProfile',
  components: { RoundUserImage, ContentPane },
  props: {
    profileId: { type: String, required: true },
  },
  data() {
    return {
      user: null,
    }
  },
  mounted() {
    this.$store
      .dispatch('ps/fetchUserProfile', {
        profileId: this.profileId,
      })
      .then(res => {
        this.user = res
      })
  },
  methods: {
    userProfileImage() {
      return config.BASE_URL + this.user.image
    },
  },
}
</script>

<style lang="scss" scoped>
.user-info-highlight {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border: 1px solid $color-light-grey;
  border-radius: $border-radius;
  padding: 10px;
  margin-top: 20px;
  * {
    text-align: left;
  }
  div {
    &:nth-child(2) {
      padding: 0 10px;
      border-right: 1px solid $color-white-grey;
      border-left: 1px solid $color-white-grey;
    }
  }
}
</style>
