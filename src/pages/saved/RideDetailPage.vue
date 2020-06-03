<template>
  <content-pane>
    <v-row dense class="pa-0">
      <v-col class="mb-3 py-0">
        <h1>Rit details</h1>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="py-0">
        <v-divider />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">Datum</v-col>
      <v-col cols="8" class="departure-date">
        {{ formatDate() }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">Reisduur</v-col>
      <v-col cols="8">
        {{ formatDuration() }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">Boekingen</v-col>
      <v-col cols="8">
        {{ ride.bookings.length }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">Auto</v-col>
      <v-col cols="8">{{ ride.car.brand }} {{ ride.car.model }}</v-col>
    </v-row>
    <v-row v-if="ride.recurrence" dense>
      <v-col cols="4">Herhalen</v-col>
      <v-col cols="8">
        {{ formatRecurrence() }}
        <table v-if="ride.recurrence.unit == 'WEEK'" class="equal-width">
          <tr>
            <td>ma</td>
            <td>di</td>
            <td>wo</td>
            <td>do</td>
            <td>vr</td>
            <td>za</td>
            <td>zo</td>
          </tr>
          <tr>
            <td v-for="day in [0, 1, 2, 3, 4, 5, 6]" :key="day">
              <v-icon>
                {{ recursOn(day) ? 'done' : '' }}
              </v-icon>
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>
    <v-row class="pb-3">
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row
      v-for="(leg, index) in generateSteps()"
      :key="index"
      class="mx-3 py-0"
    >
      <itinerary-leg :leg="leg" />
    </v-row>
    <v-row v-if="ride.bookings.length > 0">
      <v-col class="mx-1">
        <v-btn
          large
          rounded
          block
          outlined
          color="primary"
          @click="contactPassenger"
        >
          Stuur bericht naar passagier
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-2">
      <v-col>
        <h3 class="mb-2">Wijzigen</h3>
        <v-divider />
        <v-row @click="checkDeleteTrip()">
          <v-col cols="3" class="text-center">
            <v-icon>lock</v-icon>
          </v-col>
          <v-col>
            Reis annuleren
          </v-col>
        </v-row>
        <v-dialog v-model="warningDialog">
          <v-card>
            <v-card-title class="headline">
              Weet u dit zeker?
            </v-card-title>

            <v-card-text v-if="ride.bookings.length > 0">
              <p>
                Op dit moment heeft uw reis
                {{ ride.bookings.length }} boekingen, wilt u uw passagier(s) een
                reden geven waarom u de reis annuleert.
              </p>
              <v-textarea
                outlined
                name="input-7-4"
                label="Reden voor annulering"
                :value="cancelReason"
              ></v-textarea>
            </v-card-text>
            <v-card-text v-else>
              <p>
                Weet u zeker dat u deze rit wil annuleren?
              </p>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="primary" @click="deleteTrip()">
                Ja
              </v-btn>

              <v-btn text color="primary" @click="warningDialog = false">
                Nee
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-divider />
      </v-col>
    </v-row>
    <contact-traveller-modal
      v-if="showContactTravellerModal"
      :show="showContactTravellerModal"
      :users="passengersInBookings"
      @close="showContactTravellerModal = false"
      @select="onTravellerSelectForMessage"
    ></contact-traveller-modal>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ContentPane from '@/components/common/ContentPane.vue'
import ContactTravellerModal from '@/components/itinerary-details/ContactTravellerModal'

export default {
  name: 'RideDetailPage',
  components: { ContactTravellerModal, ContentPane, ItineraryLeg },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // for now, assume the ride is always available (may change when deeplinking from a notification)
      ride: this.$store.getters['cs/getRides'].find(
        ride => ride.id === this.id
      ),
      selectedLeg: null,
      warningDialog: false,
      cancelReason: '',
      showContactTravellerModal: false,
    }
  },
  computed: {
    passengersInBookings() {
      return this.ride.bookings.map(booking => {
        return {
          name:
            booking.passenger.givenName + ' ' + booking.passenger.familyName,
          passengerRef: booking.passengerRef,
          ...booking.passenger,
        }
      })
    },
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    formatDate() {
      return moment(this.ride.departureTime)
        .locale('nl')
        .format('dddd DD-MM-YYYY')
    },
    formatDuration() {
      const seconds = this.ride.duration,
        minutes = Math.round(seconds / 60)
      return minutes < 60
        ? `${minutes} minuten`
        : `${Math.floor(minutes / 60)} uur ${minutes % 60} minuten`
    },
    formatRecurrence() {
      const { unit, interval } = this.ride.recurrence
      if (unit === 'DAY') {
        return 'Dagelijks'
      }
      return interval === 1 ? 'Wekelijks op' : `Elke ${interval} weken op`
    },
    recursOn(weekday) {
      return this.ride.recurrence.daysOfWeekMask & (1 << weekday)
    },
    generateSteps() {
      const { ride } = this
      const departure = moment(ride.departureTime),
        arrival = moment(ride.estimatedArrivalTime)
      return [
        {
          mode: 'CAR',
          startTime: departure.toDate().getTime(),
          endTime: arrival.toDate().getTime(),
          from: { name: ride.fromPlace.label },
        },
        {
          mode: 'ARRIVAL',
          startTime: arrival.toDate().getTime(),
          from: { name: ride.toPlace.label },
        },
      ]
    },
    onLegSelected(leg) {
      this.selectedLeg = leg
    },
    deleteTrip() {
      this.warningDialog = false
      this.$store.dispatch('cs/deleteRide', {
        id: this.id,
        cancelReason: this.cancelReason,
      })
      this.$router.push('/tripsOverviewPage')
    },
    checkDeleteTrip() {
      this.warningDialog = true
    },
    async onTravellerSelectForMessage(event) {
      const tripContext = 'urn:nb:rs:ride:' + this.ride.id
      this.routeToConversation(tripContext, event)
    },
    contactPassenger() {
      if (this.passengersInBookings.length > 1) {
        this.showContactTravellerModal = true
      } else {
        this.onTravellerSelectForMessage(this.passengersInBookings[0])
      }
    },
    routeToConversation(ctx, passengerProfile) {
      this.$store.dispatch('ms/fetchConversations').then(conversations => {
        const index = conversations.findIndex(
          conversation => conversation.context === ctx
        )
        let params = null
        if (index !== -1) {
          //So if the conversation already exists...
          params = conversations[index]
        } else {
          //If the conversation does not exists
          //Then create a ghost conversation
          params = {
            context: ctx,
            participants: [
              {
                managedIdentity: this.$store.getters['ps/getProfile'].id,
                urn: '',
              },
              {
                ...passengerProfile,
                urn: passengerProfile.passengerRef,
              },
            ],
          }
        }

        this.$router.push({
          name: `conversation`,
          params: params,
        })
      })
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
</style>
