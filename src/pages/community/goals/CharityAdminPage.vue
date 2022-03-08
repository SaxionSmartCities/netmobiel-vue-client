<template>
  <v-form ref="form" class="full-height">
    <content-pane>
      <v-row>
        <v-col>
          <h3 v-if="!charityId">Goed doel toevoegen</h3>
          <h3 v-else>Goed doel beheren</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-12 col-sm-12 col-md-6">
          <span
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            Publieke gegevens
          </span>
          <v-row>
            <v-col>
              <v-text-field
                v-model="charity.name"
                :rules="[rules.required]"
                label="Naam"
                class="bg-white"
                outlined
                dense
                hide-details="auto"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <search-location
                :address="place"
                label="Adres"
                :outlined="true"
                field="charity"
                :favorable="false"
                :required="true"
                @search-completed="onSearchAddressCompleted"
              ></search-location>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="charity.description"
                class="bg-white"
                outlined
                dense
                label="Omschrijving"
                rows="3"
                hide-details="auto"
              >
              </v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="charity.goalAmount"
                :rules="[rules.required]"
                label="Doel bedrag (credits)"
                class="bg-white"
                type="number"
                hide-details="auto"
                outlined
                dense
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <date-menu-selector
                :value="charity.campaignStartTime"
                label="Startdatum"
                :outlined="true"
                prepend-icon="event"
                :required="true"
                @date-selected="confirmStartDate"
              ></date-menu-selector>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <date-menu-selector
                :value="charity.campaignEndTime"
                label="Einddatum"
                :outlined="true"
                prepend-icon="event"
                :min="'today'"
                @date-selected="confirmEndDate"
              ></date-menu-selector>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="charityId" class="col-12 col-sm-12 col-md-6">
          <div
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            Afbeelding
          </div>
          <v-row class="align-center">
            <v-col cols="1">
              <v-file-input
                ref="uploader"
                v-model="imageFile"
                accept="image/jpeg,image/gif, image/png"
                class="bg-white"
                hide-details="auto"
                label="Afbeelding"
                prepend-icon="image"
                :loading="isUploadingFile ? 'primary' : false"
                clearable
                outlined
                dense
                hide-input
                @change="onImageFileChange"
                @click:clear="clearImage"
              />
            </v-col>
            <v-col
              cols="8"
              class="clickable-item"
              @click="$refs.uploader.$refs.input.click()"
            >
              <v-img
                v-if="charityImage"
                class="mx-auto"
                :src="charityImage"
                max-height="150"
                max-width="150"
              />
              <div v-else>Voeg afbeelding toe</div>
            </v-col>
            <v-col cols="3">
              <v-btn
                v-if="image || charity.imageUrl"
                rounded
                color="primary"
                depressed
                outlined
                block
                @click="clearImage"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="charityId" class="col-12 col-sm-12 col-md-6">
          <div
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            Financiële gegevens
          </div>
          <div class="caption">
            De financiële gegevens zijn nodig voor de uiteindelijke uitbetaling.
          </div>
          <v-row class="pt-2">
            <v-col>
              <v-text-field
                v-model="charity.account.iban"
                class="bg-white"
                label="IBAN rekening"
                :rules="[rules.required]"
                outlined
                dense
                hide-details="auto"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="charity.account.ibanHolder"
                class="bg-white"
                label="Naam rekeninghouder"
                :rules="[rules.required]"
                outlined
                dense
                hide-details="auto"
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
            Annuleren
          </v-btn>
        </v-col>
        <v-col>
          <v-btn rounded color="button" depressed block @click="save()">
            Opslaan
          </v-btn>
        </v-col>
      </v-row>
    </content-pane>
  </v-form>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import * as chsStore from '@/store/charity-service'
import * as uiStore from '@/store/ui'
import SearchLocation from '@/components/search/SearchLocation'
import DateMenuSelector from '@/components/common/DateMenuSelector'
import moment from 'moment'
import { geoLocationToPlace, geoPlaceToCriteria } from '@/utils/Utils'
import * as gsStore from '@/store/geocoder-service'
import { scaleImageDown } from '@/utils/image_scaling'
import defaultCharityImage from '@/assets/achterhoek_background.jpg'

export default {
  name: 'CharityAdminPage',
  components: {
    ContentPane,
    SearchLocation,
    DateMenuSelector,
  },
  props: {
    charityId: { type: String, required: false, default: '' },
  },
  data() {
    return {
      isUploadingFile: false,
      imageFile: null,
      // If set to null then clear the image
      image: undefined,
      charity: {
        id: null,
        name: null,
        address: {},
        description: null,
        imageUrl: null,
        goalAmount: 0,
        campaignStartTime: null,
        campaignEndTime: null,
        account: {
          name: null,
          iban: null,
          ibanHolder: null,
        },
      },
      place: null,
      rules: {
        required: (value) => !!value || 'Verplicht veld',
      },
    }
  },
  computed: {
    selectedCharity() {
      return chsStore.getters.getSelectedCharity
    },
    charityImage() {
      return this.image
        ? this.image
        : this.charity?.imageUrl
        ? this.charity?.imageUrl
        : defaultCharityImage
    },
  },
  watch: {
    // Whenever the input changes update the form fields
    selectedCharity() {
      // Deep copy input
      if (this.selectedCharity?.id) {
        this.charity = JSON.parse(JSON.stringify(this.selectedCharity))
        this.place = geoLocationToPlace(this.charity.location)
      }
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    gsStore.mutations.setGeoLocationPicked({
      query: '',
      field: 'charity',
      place: undefined,
    })
    if (this.charityId) {
      chsStore.actions.fetchCharity(this.charityId)
    }
  },
  methods: {
    save() {
      // Synchronize name of the account and the name of the charity
      this.charity.account.name = this.charity.name
      if (!this.charity.id) {
        // Charity does not exist yet, create a new charity
        // Once created reload this same page to add the image etc.
        chsStore.actions.createCharity(this.charity).then((location) => {
          this.$router.push({
            name: 'charityAdminPage',
            param: location,
          })
        })
      } else {
        // Update the charity: Charity details, image (if updated), financial details
        const updatePromise = chsStore.actions.updateCharity(this.charity)
        let updateImagePromise
        if (this.image === null) {
          updateImagePromise = chsStore.actions.removeCharityImage(
            this.charity.urn
          )
        } else if (this.image !== undefined) {
          updateImagePromise = chsStore.actions.updateCharityImage({
            id: this.charity.urn,
            image: this.image,
          })
        } else {
          updateImagePromise = Promise.resolve()
        }
        const updateAccountPromise = chsStore.actions.updateCharityAccount({
          id: this.charity.urn,
          account: this.charity.account,
        })
        Promise.all([
          updatePromise,
          updateImagePromise,
          updateAccountPromise,
        ]).then(() => {
          this.$router.push({
            name: 'charityOverviewPage',
          })
        })
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    validate() {
      this.$refs.form.validate()
    },
    onSearchAddressCompleted(place) {
      this.charity.location = geoPlaceToCriteria(place)
    },
    confirmStartDate(date) {
      // Add midnight time and UTC offset
      this.charity.campaignStartTime = moment(date).utc().toISOString()
    },
    confirmEndDate(date) {
      this.charity.campaignEndTime = moment(date).utc().toISOString()
    },
    clearImage() {
      this.image = null
      // This will not have effect on the backend, but it provides has the right feedback to the user
      this.charity.imageUrl = null
    },
    onImageFileChange(file) {
      if (file) {
        const fileReader = new FileReader()
        fileReader.onload = () => {
          this.isUploadingFile = true
        }
        fileReader.onloadend = async () => {
          this.isUploadingFile = false
          const imageString = fileReader.result
          scaleImageDown(imageString, 200).then((resizedImage) => {
            this.image = resizedImage
          })
        }
        // fileReader.readAsDataURL(event.target.files[0])
        fileReader.readAsDataURL(file)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-image {
  border-radius: 10px;
}
</style>
