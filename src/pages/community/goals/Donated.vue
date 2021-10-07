<template>
  <content-pane>
    <v-row class="donated-row">
      <v-col class="donated-col">
        <div class="d-flex flex-row">
          <div class="full-height align-self-center">
            <h3>
              Gedoneerd 🎉
            </h3>
          </div>
        </div>
        <div class="mt-6">
          <span>
            Jouw credits zijn gedoneerd, dankjewel!
            <em>{{ charityName }}</em> is automatisch op de hoogte gebracht.
          </span>
        </div>

        <div class="mt-8">
          <v-btn
            large
            rounded
            block
            depressed
            color="button"
            class="mb-2"
            @click="supportGoal()"
          >
            Steun nog een doel
          </v-btn>
          <v-btn
            large
            rounded
            outlined
            block
            color="primary"
            @click="showAllDonations()"
          >
            Bekijk alle donaties
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../../components/common/ContentPane'
import * as chsStore from '@/store/charity-service'
export default {
  name: 'Donated',
  components: { ContentPane },
  props: {
    charityId: { type: String, required: true },
    charityName: { type: String, required: true },
  },
  methods: {
    supportGoal() {
      this.$router.push({ name: 'charityOverviewPage' })
    },
    showAllDonations() {
      this.$router.push({
        name: 'charityDetails',
        params: { id: this.charityId },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.donated-row {
  height: 100%;
  .donated-col {
    padding-top: 10vh;
    .party-icon {
      margin-left: 20px;
      max-width: 35px;
    }
  }
}
</style>
