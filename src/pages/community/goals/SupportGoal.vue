<template>
  <content-pane>
    <v-row align="center" justify="center">
      <v-col>
        <v-img
          src="@/assets/achterhoek_background.jpg"
          lazy-src="https://picsum.photos/id/11/100/60"
          aspect-ratio="1"
          class="goal-jumbo-image"
          max-width="500"
          max-height="300"
        >
        </v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col pt-0>
        <h2 class="netmobiel">
          {{ charity ? charity.name : '' }}
        </h2>
        <span class=" overline">{{ charity ? charity.placec : '' }}</span>
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
import * as chsStore from '@/store/charity-service'

export default {
  name: 'SupportGoal',
  components: { ContentPane },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      donationAmount: 0,
      donationMessage: '',
      isAnonymous: false,
    }
  },
  computed: {
    charity() {
      return chsStore.getters.getSelectedCharity
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    donate() {
      const { id, firstName, lastName } = this.$store.getters['ps/getProfile']
      chsStore.actions.donate({
        id: this.id,
        amount: this.donationAmount,
        message: this.donationMessage,
        isAnonymous: this.isAnonymous,
        sender: {
          id,
          firstName,
          lastName,
        },
      })
      this.$router.push({
        name: 'donated',
        params: { name: this.charity.name },
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
