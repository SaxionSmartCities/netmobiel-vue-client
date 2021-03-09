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
        <charity-details />
      </v-col>
      <v-col>
        <h3>Financiele gegevens</h3>
        <v-row>
          <v-col>
            <v-text-field
              class="bg-white"
              hide-details
              outlined
              readonly
              dense
              label="Naam rekeninghouder"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              class="bg-white"
              hide-details
              outlined
              readonly
              dense
              label="IBAN rekening"
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
import * as uiStore from '@/store/ui'

export default {
  name: 'CharityNew',
  components: {
    ContentPane,
    CharityDetails,
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    save() {
      console.log('Not yet implemented')
    },
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss"></style>
