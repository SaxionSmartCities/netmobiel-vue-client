<template>
  <content-pane>
    <v-row align="center" justify="center">
      <v-col>
        <v-img
          :src="charityImage"
          class="goal-jumbo-image"
          max-width="500"
          max-height="500"
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col pt-0>
        <h2 class="netmobiel">
          {{ charity ? charity.name : '' }}
        </h2>
        <span class="overline">{{
          charity ? charity.location.label : ''
        }}</span>
      </v-col>
    </v-row>
    <v-row class="flex-column">
      <v-col>
        <span class="text-color-primary subtitle-1">
          Hoeveel credits wil je doneren?
        </span>
        <v-text-field
          v-model="donationAmount"
          class="input-support-goal"
          outlined
          dense
          hide-details
          placeholder="0"
          type="number"
          :rules="[rules.positive]"
        >
        </v-text-field>
      </v-col>
      <v-col>
        <span class="text-color-primary subtitle-1">
          Persoonlijk bericht (optioneel)
        </span>
        <v-textarea
          v-model="donationMessage"
          outlined
          hide-details
        ></v-textarea>
        <v-switch
          v-model="isAnonymous"
          color="primary"
          hide-details
          inset
          :label="'Maak mijn donatie anoniem.'"
        >
        </v-switch>
      </v-col>
      <v-col>
        <v-btn
          rounded
          color="button"
          depressed
          block
          :disabled="donationAmount <= 0"
          @click="donate()"
        >
          Nu doneren
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as uiStore from '@/store/ui'
import * as bsStore from '@/store/banker-service'
import defaultCharityImage from '@/assets/achterhoek_background.jpg'

export default {
  name: 'SupportGoalPage',
  components: { ContentPane },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      donationAmount: 0,
      donationMessage: '',
      isAnonymous: false,
      rules: {
        positive: (value) => value > 0 || '',
      },
    }
  },
  computed: {
    charityImage() {
      return this.charity?.imageUrl
        ? this.charity?.imageUrl
        : defaultCharityImage
    },
    charity() {
      return bsStore.getters.getSelectedCharity
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    donate() {
      bsStore.actions.donate({
        charityRef: this.id,
        amount: this.donationAmount,
        description: this.donationMessage,
        anonymous: this.isAnonymous,
      })
      this.$router.push({
        name: 'donated',
        params: {
          charityId: this.id,
          charityName: this.charity.name,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.goal-jumbo-image {
  border-radius: 10px;
}
.input-support-goal {
  max-width: 100px;
}
</style>
