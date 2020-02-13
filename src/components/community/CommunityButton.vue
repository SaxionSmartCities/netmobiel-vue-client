<template>
  <v-card outlined max-width="220">
    <v-row wrap no-gutters>
      <v-col>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" align="center">
              <v-badge
                overlap
                color="red"
                :value="aantalBerichten"
                :content="aantalBerichten"
              >
                <v-icon>{{ icon }}</v-icon>
              </v-badge>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" align="center">
              <div>{{ naam }}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    aantalBerichten: {
      type: Number,
      default: 0,
      required: false,
    },
    icon: {
      type: String,
      required: true,
    },
    naam: {
      type: String,
      required: true,
    },
    forward: {
      type: String,
      required: false,
    },
  },
}
</script>

<style></style>
