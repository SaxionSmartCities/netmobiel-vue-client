<template>
  <v-row>
    <v-col>
      <div v-for="({ totalDonated, user }, index) in donors" :key="index">
        <div class="d-flex flex-row mb-3">
          <round-user-image
            :profile-image="user.image"
            :image-size="40"
            :avatar-size="46"
          >
          </round-user-image>
          <div class="d-flex flex-column ml-4">
            <span class="body-1 font-weight-medium">
              {{
                user.isAnonymous ? '-' : user.firstName + ' ' + user.lastName
              }}
            </span>
            <span class="body-2 grey--text">
              {{ totalDonated + ' credits gedoneerd' }}
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
  name: 'TopDonorList',
  components: { RoundUserImage },
  props: {
    donors: { type: Array, required: true },
  },
}
</script>

<style scoped></style>
