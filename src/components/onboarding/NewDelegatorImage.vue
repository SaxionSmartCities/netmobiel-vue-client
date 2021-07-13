<template>
  <v-row no-gutters>
    <v-col dense>
      <profile-image v-model="profile" />
      <v-row>
        <v-col>
          <v-col class="pa-0">
            Wat moet de chauffeur verder weten?
          </v-col>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea v-model="value.remark" outlined hide-details>
          </v-textarea>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ProfileImage from '@/components/profile/ProfileImage.vue'

export default {
  name: 'NewDelegationImage',
  components: {
    ProfileImage,
  },
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      profile: {
        image: null,
      },
    }
  },
}
</script>
