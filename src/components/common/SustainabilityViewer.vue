<template>
  <v-container
    v-if="sustainabilityRatingIcon"
    class="d-inline-flex selectable pa-0"
    @click="showDialog = true"
  >
    <v-img :src="sustainabilityRatingIcon" max-width="100" contain="contain" />
    <v-icon class="ma-0 pl-2">info_outline</v-icon>
    <sustainability-dialog
      :itinerary="itinerary"
      :show-dialog="showDialog"
      @close="showDialog = false"
    />
  </v-container>
</template>

<script>
import constants from '@/constants/constants'
import SustainabilityDialog from '@/components/dialogs/SustainabilityDialog.vue'

export default {
  name: 'SustainabilityViewer',
  components: { SustainabilityDialog },
  props: {
    itinerary: { type: Object, required: true },
  },
  data() {
    return {
      showDialog: false,
    }
  },
  computed: {
    sustainabilityRatingIcon() {
      const rating = this.itinerary?.sustainabilityRating
      if (Number.isInteger(rating) && rating >= 1 && rating <= 5) {
        const icon = constants.SUSTAINABILITY_RATINGS[rating - 1].iconPath
        return require(`@/assets/${icon}`)
      }
      return ''
    },
  },
  methods: {
    onInfoClick(option) {
      this.dialog.title = option.title
      this.dialog.content = option.info
      this.dialogIsVisible = true
    },
  },
}
</script>
<style lang="scss" scoped>
.selectable {
  cursor: pointer;
}
</style>
