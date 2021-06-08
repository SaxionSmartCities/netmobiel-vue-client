<template>
  <v-row no-gutters>
    <v-col dense>
      <v-row>
        <v-col class="pb-0" align="center">
          Foto
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h4 class="netmobiel">
            Wat moet de chauffeur verder weten?
          </h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          Kan <em>{{ value.firstName }}</em> bij aankomst vervoerder direct
          instappen?
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'NewDelegationImage',
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
}
</script>
