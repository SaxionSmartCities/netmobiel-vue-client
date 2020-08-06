<template>
  <v-card max-width="500px" class="pa-5" outlined>
    <v-row>
      <v-col class="shrink py-0">
        <v-img
          class="charity-card-image"
          alt="Geen afbeelding beschikbaar"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/24436_Leeuwarden_St._Bonifatiuskerk_07.JPG/1200px-24436_Leeuwarden_St._Bonifatiuskerk_07.JPG"
        />
      </v-col>
      <v-col class="py-0 pl-1">
        <div class="d-flex flex-column">
          <span class="body-2">{{ charity.name }}</span>
          <span class="overline">{{ charity.place }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <span
          class="progressbar-text text-color-primary caption"
          :style="{ left: (charity.progress || 0) - 3 + '%' }"
        >
          {{ charity.progress || 0 }}%
        </span>
        <v-progress-linear v-model="charity.progress" rounded>
        </v-progress-linear>
      </v-col>
    </v-row>
    <v-row justify="space-between" class="mx-auto">
      <v-col class="px-0 pb-0">
        <span class="body-1"> nog {{ creditsRemaining }} credits </span>
      </v-col>
      <v-col class="px-0 pb-0">
        <v-btn
          color="primary"
          class="font-weight-bold"
          small
          rounded
          depressed
          outlined
          @click="$emit('lookupCharity', charity._id)"
        >
          Bekijk dit doel
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'CharityCard',
  components: {},
  props: {
    charity: { type: Object, required: true },
  },
  computed: {
    creditsRemaining() {
      return 20
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.charity-card-image {
  width: 75px;
  height: 75px;
  border-radius: 10px;
}

.progressbar-text {
  position: relative;
}
</style>
