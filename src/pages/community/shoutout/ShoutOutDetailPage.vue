<template>
  <content-pane>
    <v-row>
      <v-col class="py-0">
        <v-row dense class="d-flex flex-column">
          <v-col><h1>Oproep details</h1></v-col>
          <v-col><v-divider /></v-col>
          <v-col class="py-0">
            <itinerary-summary
              :from="tripFromLabel"
              :to="tripToLabel"
              :date="trip.travelTime"
              :duration="tripDuration"
              :revenue="15"
            />
          </v-col>
          <v-col><v-divider /></v-col>
          <!-- Passenger -->
          <v-col v-if="localIsMine" class="mt-3">
            <v-row
              v-for="(leg, index) in generateShoutOutSteps()"
              :key="index"
              class="mx-3 py-0"
            >
              <itinerary-leg :leg="leg" />
            </v-row>
            <v-row dense class="d-flex flex-column">
              <v-col><v-divider /></v-col>
              <v-col>
                <h3>Rit aanbod</h3>
              </v-col>
              <v-col class="py-3">
                <em>Er zijn nog geen ritten aangeboden.</em>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-3 pb-0">
                <h3>Wijzigen</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <itinerary-options
                  :selected-trip="trip"
                  @tripEdit="onTripEdit"
                  @tripCancelled="onTripCancelled"
                >
                </itinerary-options>
              </v-col>
            </v-row>
          </v-col>
          <!-- Chauffeur -->
          <v-col v-else>
            <v-row dense class="d-flex flex-column">
              <v-col v-if="planningStatus.status === 'PENDING'">
                <search-status />
              </v-col>
              <v-col v-else>
                <v-row>
                  <v-col v-if="itineraries.length == 0" py-4>
                    <em>Helaas, er is geen route gevonden!</em>
                  </v-col>
                  <v-col v-else class="py-0">
                    <v-row v-if="editDepart" class="bg-light-green pt-0 mb-4">
                      <v-col cols="3">
                        <v-dialog v-model="showTimePicker" persistent>
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              class="bg-white"
                              dense
                              hide-details
                              outlined
                              readonly
                              label="Vertrek"
                              :value="pickedTime"
                              v-on="on"
                            />
                          </template>
                          <v-card>
                            <!-- v-if forces initialization of time picker when dialog is reopened -->
                            <v-time-picker
                              v-if="showTimePicker"
                              v-model="pickedTime"
                              full-width
                              scrollable
                              :allowed-minutes="allowedMinutes"
                              format="24hr"
                              class="time-picker"
                            />
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="showTimePicker = false"
                              >
                                Annuleren
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                :disabled="!pickedTime"
                                @click="confirmTime"
                              >
                                Ok
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-col>
                      <v-col cols="8">
                        <v-text-field
                          class="bg-white"
                          dense
                          hide-details
                          outlined
                          readonly
                          label="Van"
                          :value="itineraryDeparture.from.label"
                          @click="onDepartureSelected"
                        />
                      </v-col>
                    </v-row>
                    <v-row
                      v-for="(leg, index) in generateSteps(
                        planResult.plan.itineraries[0]
                      )"
                      :key="index"
                      class="mx-3 py-0"
                    >
                      <itinerary-leg :leg="leg" @legEdit="onLegEdit" />
                    </v-row>
                    <v-row>
                      <v-col class="pt-3 pb-0">
                        <v-btn
                          :disabled="planningStatus.status != 'SUCCESS'"
                          large
                          rounded
                          block
                          mb-4
                          depressed
                          color="button"
                          @click="bookTrip"
                        >
                          Rit aanbieden
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-1">
                <v-btn
                  :disabled="planningStatus.status != 'SUCCESS'"
                  large
                  rounded
                  block
                  outlined
                  color="primary"
                  @click="contactPassenger"
                >
                  Bericht sturen naar passagier
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import ContentPane from '@/components/common/ContentPane.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import ItinerarySummary from '@/components/itinerary-details/ItinerarySummary.vue'
import SearchStatus from '@/components/search/SearchStatus.vue'
import { DATE_FORMAT_INPUT, TIMESTAMP_FORMAT } from '@/utils/datetime.js'
import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'
import {
  generateShoutOutDetailSteps,
  generateItineraryDetailSteps,
} from '@/utils/itinerary_steps.js'

export default {
  name: 'ShoutOutDetailPage',
  components: {
    ContentPane,
    ItineraryLeg,
    ItineraryOptions,
    ItinerarySummary,
    SearchStatus,
  },
  props: {
    id: { type: String, required: true },
    // isMine is a string because it is a path parameter. When routing back from
    // picking a location the path param is sent as a string. If we make it a
    // boolan here then we get a type conversion error. The 'localIsMine'
    // computed property let's us treat it as a boolean.
    isMine: { type: String, default: null, required: true },
    allowedMinutes: { type: Function, default: m => m % 5 == 0 },
  },
  data() {
    return {
      ride: null,
      showMap: false,
      editDepart: false,
      showTimePicker: false,
      pickedTime: null,
      planningResponse: {
        status: 'PENDING',
      },
    }
  },
  computed: {
    ...mapGetters({
      trip: 'is/getSelectedTrip',
      planningStatus: 'is/getPlanningStatus',
      planResult: 'is/getPlanningResults',
      pickedLocations: 'gs/getPickedLocation',
    }),
    localIsMine() {
      return this.isMine === 'true'
    },
    tripFromLabel() {
      return this.trip?.from?.label
    },
    tripToLabel() {
      return this.trip?.to?.label
    },
    tripDuration() {
      return this.itinerary?.duration
    },
    itineraryDepartureTime() {
      return moment(this.itineraryDeparture.from.departureTime).format('HH:mm')
    },
    itineraryDeparture() {
      return this.generateSteps(this.itinerary)[0]
    },
    itinerary() {
      if (this.itineraries.length > 0) {
        return this.itineraries[0]
      }
      return null
    },
    itineraries() {
      return this.planResult?.plan?.itineraries || []
    },
  },
  mounted() {
    this.$store.commit('is/clearPlanningResults')
    this.$store.dispatch('is/fetchShoutOut', { id: this.id })
    if (!this.localIsMine) {
      // Propose a ride to the chauffeur based on his address and the shoutout.
      const { ridefrom } = this.$store.getters['gs/getPickedLocation']
      const { address } = this.$store.getters['ps/getUser'].profile
      const from = ridefrom
        ? {
            label:
              ridefrom.label || `${ridefrom.title} ${ridefrom.vicinity || ''}`,
            latitude: ridefrom.position[0],
            longitude: ridefrom.position[1],
          }
        : {
            label: 'Thuis',
            latitude: address?.location?.coordinates[1],
            longitude: address?.location?.coordinates[0],
          }
      this.$store.commit('gs/setGeoLocationPicked', {
        field: 'ridefrom',
        suggestion: null,
      })
      this.$store.dispatch('is/submitShoutOutPlanningsRequest', {
        id: this.id,
        from: from,
      })
    }
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  beforeRouteEnter: beforeRouteEnter({
    editDepart: editing => editing || false,
    pickedTime: timestamp => timestamp || null,
  }),
  beforeRouteLeave: beforeRouteLeave({
    editDepart: editing => editing || false,
    pickedTime: timestamp => timestamp || null,
  }),
  methods: {
    generateShoutOutSteps() {
      return generateShoutOutDetailSteps(this.trip)
    },
    generateSteps(itinerary) {
      let itinerarySteps = generateItineraryDetailSteps(itinerary)
      itinerarySteps[0].isEditable = true
      if (itinerarySteps.length > 2) {
        itinerarySteps[itinerarySteps.length - 2].passenger = {
          ...this.trip.traveller,
        }
      }
      return itinerarySteps
    },
    onLegEdit({ step }) {
      if (step == 0) {
        this.pickedTime = this.itineraryDepartureTime
        this.editDepart = !this.editDepart
      }
    },
    onDepartureSelected() {
      let params = { field: 'ridefrom' }
      this.$router.push({ name: 'searchLocation', params })
    },
    confirmTime() {
      this.showTimePicker = false
      const { label, latitude, longitude } = this.itineraryDeparture.from
      const depart = moment(this.itineraryDeparture.from.departureTime)
      let timestamp = `${depart.format(DATE_FORMAT_INPUT)} ${this.pickedTime}`
      this.$store.dispatch('is/submitShoutOutPlanningsRequest', {
        id: this.id,
        from: { label, latitude, longitude },
        travelTime: {
          when: moment(timestamp, TIMESTAMP_FORMAT),
          arriving: false,
        },
      })
    },
    bookTrip() {
      //TODO:
      console.log('Method not implemented!')
    },
    contactPassenger() {
      console.log('Method not implemented!')
    },
    onTripEdit() {
      const { searchPreferences } = this.$store.getters['ps/getProfile']
      let searchCriteria = {
        from: this.trip.from,
        to: this.trip.to,
        preferences: searchPreferences,
        travelTime: {
          when: this.trip.useAsArrivalTime
            ? moment(this.trip.latestArrivalTime)
            : moment(this.trip.earliestDepartureTime),
          arriving: this.trip.useAsArrivalTime,
        },
      }
      this.$store.commit('is/setSearchCriteria', searchCriteria)
      this.$store.dispatch('is/submitPlanningsRequest', searchCriteria)
      this.$router.push({ name: 'searchResults', editTrip: true })
    },
    onTripCancelled() {
      //TODO:
    },
  },
}
</script>
<style scoped>
.departure-date {
  text-transform: lowercase;
}
.departure-date::first-letter {
  text-transform: uppercase;
}
.equal-width {
  width: 100%;
}
.equal-width td {
  width: 14.14%;
  text-align: center;
}
.bg-light-green {
  background-color: rgba(46, 137, 151, 0.1);
}
</style>
