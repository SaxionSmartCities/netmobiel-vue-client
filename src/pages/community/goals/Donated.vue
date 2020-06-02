<template>
  <content-pane>
    <v-row class="donated-row">
      <v-col class="donated-col">
        <div class="d-flex flex-row">
          <div class="full-height align-self-center">
            <h3>
              Gedoneerd
            </h3>
          </div>
          <v-img class="party-icon" :src="partyIcon"></v-img>
        </div>
        <div class="mt-6">
          <span>
            Jouw credits zijn gedoneerd, dankjewel! {{ name }} is automatisch op
            de hoogte gebracht
          </span>
        </div>

        <div class="mt-8">
          <v-btn large rounded block depressed color="button" class="mb-2">
            Steun nog een doel
          </v-btn>
          <v-btn large rounded outlined block color="primary">
            Bekijk alle donaties
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../../components/common/ContentPane'
export default {
  name: 'Donated',
  components: { ContentPane },
  props: {
    name: { type: String, required: true },
  },
  data() {
    return {
      partyIcon:
        'data:image/png;base64,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',
    }
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
