<template>
  <generic-list :items="delegations" :empty-list-label="emptyListLabel">
    <template #list-item="{ item: delegation }">
      <!-- Clear the right because of the ybug feedback button -->
      <v-row dense class="align-center mr-4">
        <v-col class="shrink pr-3 mb-3">
          <round-user-image
            :profile-image="delegation.delegator.image"
            :image-size="54"
            :avatar-size="60"
          />
        </v-col>
        <v-col>
          <span class="body-1 font-weight-medium">
            {{ name(delegation.delegator) }}
          </span>
          <br />
          <span class="body-2 grey--text">
            Woonplaats
            {{ locality(delegation.delegator) }}
          </span>
        </v-col>
        <v-col v-if="delegation.activationTime == null" class="shrink">
          <v-icon class="material-icons-outlined" color="button">
            watch_later
          </v-icon>
        </v-col>
        <v-col class="shrink">
          <v-icon
            :disabled="selectedId != null"
            @click="deleteDeletation(delegation)"
          >
            delete
          </v-icon>
        </v-col>
        <v-col v-if="selectedId === delegation.delegator.id" class="shrink">
          <v-icon large color="button"> check </v-icon>
        </v-col>
        <v-col v-else class="shrink">
          <v-icon large @click="switchAccount(delegation.delegator.id)">
            chevron_right
          </v-icon>
        </v-col>
      </v-row>
      <v-row
        v-if="delegation.activationTime == null"
        dense
        class="caption align-center"
      >
        <v-col>
          Een SMS met een activeringscode is verstuurd naar deze gebruiker op
          {{ displayDate(delegation.submissionTime) }}. Vraag deze persoon naar
          deze code en activeer de machtiging.
        </v-col>
        <v-col class="shrink">
          <v-btn
            small
            rounded
            depressed
            color="button"
            @click="$emit('activate-delegation', delegation)"
          >
            Code invoeren
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </generic-list>
</template>

<script>
import RoundUserImage from '@/components/common/RoundUserImage'
import GenericList from './GenericList.vue'
import { formatDateTimeLongNoYearWithTime } from '@/utils/datetime'

export default {
  name: 'DelegatorList',
  components: { RoundUserImage, GenericList },
  props: {
    delegations: { type: Array, required: true },
    selectedId: { type: String, default: null },
  },
  data() {
    return {
      emptyListLabel:
        'Je beheert op dit moment geen accounts van andere gebruikers.',
    }
  },
  methods: {
    switchAccount(userId) {
      this.$emit('AccountSelected', userId)
    },
    deleteDeletation(delegation) {
      this.$emit('DelegationDelete', delegation)
    },
    name(profile) {
      return profile
        ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()
        : 'Onbekend'
    },
    locality(profile) {
      return profile?.address?.locality ?? 'Onbekend'
    },
    displayDate(dt) {
      return formatDateTimeLongNoYearWithTime(dt)
    },
  },
}
</script>

<style lang="scss" scoped>
.secondary-color {
  color: $color-orange !important;
}
</style>
