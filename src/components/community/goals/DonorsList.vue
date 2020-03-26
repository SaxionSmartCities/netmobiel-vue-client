<template>
  <v-list width="100%">
    <v-list-item-group>
      <template v-for="(donor, index) in donors">
        <v-divider v-if="index > 0" :key="index" class="mx-3" />
        <v-list-item :key="donor.id">
          <v-list-item-content>
            <v-row>
              <v-col cols="2">
                <v-list-item-avatar
                  tilesize="100"
                  color="grey"
                ></v-list-item-avatar>
              </v-col>
              <v-col>
                <v-row>
                  <span class="subtitle-2 text-no-wrap pr-2">{{
                    donor.username
                  }}</span>
                </v-row>
                <v-row>
                  <span class="overline"
                    >{{ donor.currentValue }} credits gedoneerd</span
                  >
                </v-row>
              </v-col>
              <v-col>
                <v-btn rounded color="button" dark>
                  <v-icon>fa-user-plus</v-icon></v-btn
                ></v-col
              >
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: 'DonorsList',
  props: {
    donors: { type: Array, required: true },
  },
}
</script>

<style scoped></style>
