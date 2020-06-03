<template>
  <v-list width="100%">
    <v-list-item-group>
      <template v-for="(donor, index) in donors">
        <v-divider v-if="index > 0" :key="index" />
        <v-list-item :key="donor.id" class="px-0">
          <v-list-item-content>
            <v-row dense>
              <v-col cols="3">
                <round-user-image :image-size="60" :avatar-size="66">
                </round-user-image>
              </v-col>
              <v-col class="px-0">
                <v-row dense>
                  <v-col>
                    <span class="subtitle-2 text-no-wrap pr-2">{{
                      getScreenName(donor)
                    }}</span>
                    <br />
                    <span class="overline"
                      >{{ donor.creditsDonated }} credits gedoneerd
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="3" class="my-auto">
                <!--
                <v-btn rounded block color="button" dark>
                  <v-icon>fa-user-plus</v-icon></v-btn
                > -->
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'

export default {
  name: 'DonorsList',
  components: {
    RoundUserImage,
  },
  props: {
    donors: { type: Array, required: true },
  },
  methods: {
    getScreenName(donor) {
      //If donor wants to remain anonymous, set screen name to "Netmobiel Gebruiker".
      if (donor.anonymous) {
        return 'Netmobiel Gebruiker'
      } else {
        return donor.name
      }
    },
  },
}
</script>

<style scoped></style>
