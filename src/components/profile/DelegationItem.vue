<template>
  <div>
    <!-- Clear the right because of the ybug feedback button -->
    <v-row dense class="align-center mr-2">
      <v-col class="shrink pr-3 mb-3">
        <round-user-image
          :profile-image="delegation.delegator.image"
          :image-size="54"
          :avatar-size="60"
        />
      </v-col>
      <v-col>
        <span class="body-1 font-weight-medium">
          {{ delegatorName }}
        </span>
        <br />
        <span class="body-2 grey--text">
          Woonplaats
          {{ delegatorLocality }}
        </span>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-icon
          v-if="delegation.activationTime == null"
          class="mx-1 material-icons-outlined"
          :color="isExpired ? 'error' : 'success'"
        >
          watch_later
        </v-icon>
        <v-icon
          class="mx-1"
          :disabled="selected"
          @click="$emit('remove', delegation)"
        >
          delete
        </v-icon>
        <v-icon v-if="selected" class="mx-1" large color="button">
          check
        </v-icon>
        <v-icon
          v-else-if="isSelectable"
          class="mx-1"
          large
          @click="$emit('select', delegation)"
        >
          chevron_right
        </v-icon>
        <!-- Keep the icons inline vertically -->
        <v-icon v-else class="mx-1 invisible" large> chevron_right </v-icon>
      </v-col>
    </v-row>
    <v-row
      v-if="delegation.activationTime == null"
      dense
      class="caption align-center"
    >
      <v-col>
        <span v-if="isExpired">
          De activeringscode is vervallen. Vraag een nieuwe code aan om de
          machtiging te kunnen activeren.
        </span>
        <span v-else>
          Een SMS met een activeringscode is verstuurd naar deze gebruiker op
          {{ submissionTime }}. Vraag deze persoon naar deze code en activeer de
          machtiging. Deze code vervalt om {{ expirationTime }}
        </span>
      </v-col>
      <v-col class="shrink">
        <v-btn
          v-if="isExpired"
          small
          rounded
          depressed
          color="button"
          @click="$emit('resend-code', delegation)"
        >
          Code aanvragen
        </v-btn>
        <v-btn
          v-else
          small
          rounded
          depressed
          color="button"
          @click="$emit('activate', delegation)"
        >
          Code invoeren
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import { formatDateTimeLongNoYearWithTime } from '@/utils/datetime'
import moment from 'moment'

export default {
  name: 'DelegationItem',
  components: { RoundUserImage },
  props: {
    delegation: { type: Object, required: true },
    selected: { type: Boolean, default: false },
  },
  computed: {
    delegatorName() {
      const profile = this.delegation.delegator
      return profile
        ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()
        : 'Onbekend'
    },
    delegatorLocality() {
      const profile = this.delegation.delegator
      return profile?.address?.locality ?? 'Onbekend'
    },
    submissionTime() {
      return formatDateTimeLongNoYearWithTime(this.delegation.submissionTime)
    },
    isExpired() {
      const now = moment()
      const codeSentTime = moment(this.delegation.activationCodeSentTime)
      return codeSentTime
        .add(this.delegation.activationCodeTTL, 'seconds')
        .isBefore(now)
    },
    expirationTime() {
      const codeSentTime = moment(this.delegation.activationCodeSentTime)
      return codeSentTime
        .locale('nl')
        .add(this.delegation.activationCodeTTL, 'seconds')
        .format('HH:mm:ss')
    },
    isSelectable() {
      return (
        this.delegation.activationTime != null &&
        this.delegation.revocationTime == null
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.invisible {
  visibility: hidden;
}
</style>
