<template>
  <v-row no-gutters>
    <v-col dense>
      <v-row>
        <v-col class="pb-0">
          Hier kun je de communicatievoorkeuren aangeven voor
          <em>{{ value.firstName }}</em>
          .
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pb-0">
          <h4 class="netmobiel">
            Hoe wil {{ value.firstName }} meldingen ontvangen?
          </h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="options ma-2">
          <v-row
            v-for="(option, index) in mediumOptions"
            :key="index"
            no-gutters
          >
            <v-col class="d-flex align-center dense">
              <span>{{ option.title }}</span>
            </v-col>
            <v-col class="shrink d-flex align-center px-0 py-2">
              <v-switch
                v-model="option.value"
                class="switch-overwrite"
                hide-details
                inset
                @change="onOptionChange"
              ></v-switch>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pb-0">
          <h4 class="netmobiel">
            Meldingen die {{ value.firstName }} ontvangt?
          </h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="options ma-2">
          <v-row
            v-for="(option, index) in notificationOptions"
            :key="index"
            no-gutters
          >
            <v-col class="d-flex align-center dense">
              <span>{{ option.title }}</span>
            </v-col>
            <v-col class="shrink d-flex align-center px-0 py-2">
              <v-switch
                v-model="option.value"
                class="switch-overwrite"
                hide-details
                inset
                @change="onOptionChange"
              ></v-switch>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DelegationCommsSettings',
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      mediumOptions: [
        { title: 'SMS-bericht', selected: false },
        { title: 'Apraakbericht', selected: false },
        { title: 'Appmelding', selected: false },
      ],
      notificationOptions: [
        { title: 'Bevestiging nieuw bericht', selected: false },
        { title: 'Wijziging geplande reis', selected: false },
        { title: 'Herinerring voor aanvang reis', selected: false },
        { title: 'Nieuw persoonlijk bericht', selected: false },
      ],
    }
  },
  methods: {
    onOptionChange() {
      // eslint-disable-next-line
      console.log('TODO')
    },
  },
}
</script>
