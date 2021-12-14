<template>
  <v-row>
    <v-col>
      <div v-for="(donation, index) in donations" :key="index">
        <div class="d-flex flex-row my-2">
          <external-user-image
            :image-size="40"
            :avatar-size="46"
            :managed-identity="donation.donor.id"
          />
          <div class="d-flex flex-column ml-4">
            <span class="body-2 grey--text">
              {{ formatDateTime(donation.published) }}
            </span>
            <span class="body-2">
              {{ formatName(donation) }}
            </span>
            <span class="body-2 grey--text">
              {{ donation.credits + ' credits' }}
            </span>
            <span>
              {{ donation.message }}
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
      if (donation.donor?.id) {
        const donor = donation.donor
        name = `${donor.firstName ? donor.firstName : ''} ${
          donor.lastName ? donor.lastName : ''
        } ${donation.isAnonymous ? ' (anoniem)' : ''}`
      } else {
        name = 'Anoniem'
      }
      return name
    },
  },
}
</script>

<style scoped></style>
