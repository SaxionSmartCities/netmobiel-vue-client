<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <p class="headline">{{ title }}</p>
      </v-flex>
      <v-flex>
        <h1 class="font-weight-bold subheading mt-2 text-primary">
          {{ subTitle[0] }}
        </h1>
        <p class="font-weight-light">{{ text[0] }}</p>
      </v-flex>
      <v-flex>
        <h1 class="font-weight-bold subheading mt-2 text-primary">
          {{ subTitle[1] }}
        </h1>
        <p class="font-weight-light">{{ text[1] }}</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'TermsOfUse',
  data() {
    return {
      title: 'Gebruiksvoorwaarden',
      subTitle: ['Lorem ipsum dolor', 'Nullam dictum felis'],
      text: [
        'Sit amet, consectetur adipisicing elit, sed do eiusmod tempor\n' +
          '          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n' +
          '          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\n' +
          '          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n' +
          '          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint\n' +
          '          occaecat cupidatat non proident, sunt in culpa qui officia deserunt\n' +
          '          mollit anim id est laborum.',
        'Eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. ' +
          'Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, ' +
          'dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imp' +
          'erdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi',
      ],
    }
  },
}
</script>

<style lang="scss"></style>
