<template>
  <v-row>
    <v-col align="center">
      <round-user-image
        :image-size="92"
        :avatar-size="100"
        :profile-image="profileImage"
      ></round-user-image>
      <div class="text-center">
        <label for="file-input" class="custom-file-upload caption">
          <a>Upload afbeelding</a>
          <input id="file-input" type="file" @change="readFile" />
          <v-progress-circular
            v-if="isUploadingFile"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </label>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import { scaleImageDown } from '../../utils/image_scaling'

export default {
  name: 'ProfileImage',
  components: { RoundUserImage },
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      isUploadingFile: false,
    }
  },
  computed: {
    profileImage() {
      return this.value?.image
    },
  },
  methods: {
    readFile(event) {
      if (event.target.files[0]) {
        let fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.isUploadingFile = true
        })
        fileReader.addEventListener('loadend', async () => {
          this.isUploadingFile = false
          const imageString = fileReader.result
          scaleImageDown(imageString, 200).then(resizedImage => {
            this.value.image = resizedImage
          })
        })
        fileReader.readAsDataURL(event.target.files[0])
      }
    },
  },
}
</script>
