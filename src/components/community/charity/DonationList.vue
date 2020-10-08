<template>
  <v-row>
    <v-col>
      <div v-for="(donation, index) in donations" :key="index">
        <div class="d-flex flex-row mt-1 mb-2">
          <round-user-image :image-size="40" :avatar-size="46" />
          <div class="d-flex flex-column ml-4">
            <span class="body-1 font-weight-medium ">
              {{
                donation.isAnonymous
                  ? '-'
                  : donation.sender.firstName + ' ' + donation.sender.lastName
              }}
            </span>
            <span class="body-2 grey--text">
              {{ donation.credits + ' credits gedoneerd' }}
            </span>
            <span class="subtitle-1 mt-2">
              {{ donation.message }}
            </span>
          </div>
        </div>
        <v-divider class="mb-3"></v-divider>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
export default {
  name: 'DonationList',
  components: { RoundUserImage },
  props: { donations: { type: Array, required: true } },
}
</script>

<style scoped></style>
