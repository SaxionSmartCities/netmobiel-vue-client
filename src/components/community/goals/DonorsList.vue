<template>
  <v-list width="100%">
    <v-list-item-group>
      <template v-for="(donor, index) in donors">
        <v-divider v-if="index > 0" :key="index" class="mx-3" />
        <v-list-item :key="donor.id">
          <v-list-item-content>
            <v-row>
              <v-col cols="3">
                <round-user-image :image-size="60" :avatar-size="66">
                </round-user-image>
              </v-col>
              <v-col class="px-0">
                <v-row dense>
                  <v-col>
                    <span class="subtitle-2 text-no-wrap pr-2">{{
                      donor.username
                    }}</span>
                    <br />
                    <span class="overline"
                      >{{ donor.currentValue }} credits gedoneerd
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="3" class="my-auto">
                <!-- <v-btn large rounded block outlined color="primary" to="/howTo"> -->
                <v-btn rounded block color="button" dark>
                  <v-icon>fa-user-plus</v-icon></v-btn
                >
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
}
</script>

<style scoped></style>
