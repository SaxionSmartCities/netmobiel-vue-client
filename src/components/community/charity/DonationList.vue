<template>
  <v-row>
    <v-col>
      <div v-for="(donation, index) in donations" :key="index">
        <div class="d-flex flex-row my-2">
          <external-user-image
            :image-size="40"
            :avatar-size="46"
            :managed-identity="donation.donor && donation.donor.managedIdentity"
          />
          <div class="d-flex flex-column ml-4">
            <span class="body-2 grey--text">
              {{ formatDateTime(donation.donationTime) }}
            </span>
            <span class="body-2">
              {{ formatName(donation) }}
            </span>
            <span class="body-2 grey--text">
              {{ donation.amount }}
              {{ donation.amount === 1 ? 'credit' : 'credits' }}
            </span>
            <span>
              {{ donation.description }}
            </span>
          </div>
        </div>
        <v-divider></v-divider>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import ExternalUserImage from '@/components/profile/ExternalUserImage'

export default {
  name: 'DonationList',
  components: { ExternalUserImage },
  props: { donations: { type: Array, required: true } },
  methods: {
    formatDateTime(dateTime, format) {
      if (!format) {
        return moment(dateTime).locale('nl').calendar()
      } else {
        return moment(dateTime).local('nl').format(format)
      }
    },
    formatName(donation) {
      let name = ''
      // The admin can see the donor of an anonymous donation!
      // The calling user can see his own anonymous donations!
      if (donation.donor?.id) {
        const donor = donation.donor
        name = `${donor.givenName || ''} ${donor.familyName || ''}
        ${donation.anonymous ? ' (anoniem)' : ''}`
      } else {
        name = 'Anoniem'
      }
      return name
    },
  },
}
</script>

<style scoped></style>
