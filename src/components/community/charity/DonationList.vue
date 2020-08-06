<template>
  <v-row>
    <v-col>
      <div v-for="(donation, index) in donations" :key="index">
        <div class="d-flex flex-row">
          <round-user-image
            :profile-image="
              donation.isAnonymous
                ? ''
                : ' https://api.netmobiel.eu/gwapi/acc/images/5f/1591722701725.png'
            "
            :image-size="40"
            :avatar-size="46"
          >
          </round-user-image>
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
            <span class="subtitle-1 my-3">
              {{ donation.message }}
            </span>
          </div>
        </div>
        <v-divider class="mb-2"></v-divider>
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
