<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Goed doel toevoegen</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4>Publieke gegevens</h4>
        <charity-details v-model="charityDetails" />
      </v-col>
      <v-col>
        <h3>Financiele gegevens</h3>
        <v-row>
          <v-col>
            <v-text-field
              class="bg-white"
              label="Naam rekeninghouder"
              :rules="[rules.required]"
              outlined
              dense
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-text-field
              class="bg-white"
              label="IBAN rekening"
              :rules="[rules.required]"
              outlined
              dense
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          rounded
          color="primary"
          depressed
          outlined
          block
          @click="cancel()"
        >
          Annuleer
        </v-btn>
      </v-col>
      <v-col>
        <v-btn rounded color="button" depressed block @click="save()">
          Opslaan
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import CharityDetails from '@/components/manage/CharityDetails.vue'
import * as chsStore from '@/store/charity-service'
import * as uiStore from '@/store/ui'

export default {
  name: 'CharityNew',
  components: {
    ContentPane,
    CharityDetails,
  },
  data() {
    return {
      charityDetails: {
        name: null,
        location: {
          label: null,
          latitude: 0,
          longitude: 0,
        },
        description: null,
        imageUrl: null,
        goalAmount: 0,
        campaignStartTime: null,
        campaignEndTime: null,
      },
      rules: {
        required: value => !!value || 'Verplicht veld',
      },
    }
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    save() {
      const charity = { ...this.charityDetails }
      console.log(charity)
      // chsStore.actions.saveCharity(charity)
    },
    cancel() {
      this.$router.go(-1)
    },
    validate() {
      this.$refs.form.validate()
    },
  },
}
</script>

<style lang="scss"></style>
