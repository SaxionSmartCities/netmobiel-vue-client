<template>
  <content-pane>
    <v-row>
      <v-col class="shrink">
        <round-user-image
          :image-size="100"
          :avatar-size="105"
        ></round-user-image>
      </v-col>
      <v-col>
        <div class="d-flex flex-column">
          <span class="body-1">{{ 'Karen Alberts' }}</span>
          <span class="caption">{{ 'Aalten' }}</span>
        </div>
        <div class="d-flex flex-column mt-5">
          <span>35-40 jaar</span>
          <span>Houdt van: lezen, reizen</span>
        </div>
        <v-btn depressed color="button" rounded class="mt-3" small>
          <v-icon>add</v-icon>
          Toevoegen als vriend
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="user-info-highlight">
          <div class="d-flex flex-column text-center">
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

export default {
  name: 'UserProfile',
  components: { RoundUserImage, ContentPane },
  props: {
    profileId: { type: String, required: true },
  },
  mounted() {
    //TODO Do request
    this.$store.dispatch('ps/fetchUserProfile', {
      profileId: this.profileId,
    })
  },
}
</script>

<style lang="scss" scoped>
.user-info-highlight {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border: 1px solid lightgray;
  border-radius: $border-radius;
  padding: 10px;
  div {
    &:nth-child(2) {
      padding: 0 10px;
      border-right: 1px solid lightgray;
      border-left: 1px solid lightgray;
    }
  }
}
</style>
