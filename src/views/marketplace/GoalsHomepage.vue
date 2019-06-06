<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <p class="headline">{{ title }}</p>
      </v-flex>
      <v-divider></v-divider>
      <v-flex mt-4
        ><v-text-field
          v-model="searchInput"
          outline
          prepend-inner-icon="search"
          clearable
          placeholder="Zoeken"
          class="border-radius-input"
          single-line
        ></v-text-field
      ></v-flex>
      <v-flex mb-3>
        <h1 class="font-weight-bold subheading mt-2">Populair in de buurt</h1>
      </v-flex>
      <v-flex>
        <v-layout row class="scrolling-wrapper-flexbox">
          <goal-iteam
            v-for="i in items"
            :key="i.name"
            :item="i"
            class="item"
          ></goal-iteam>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GoalIteam from './GoalIteam'
export default {
  name: 'GoalsHomepage',
  components: { GoalIteam },
  data: function() {
    return {
      searchInput: '',
      title: 'Doelen',
      items: [
        {
          name: 'Renovatie Clubhuis',
          address: 'ZTV, Zieuwent',
          image:
            'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500',
          currentCredits: '100',
          goalCredits: '200',
        },
        {
          name: 'Macbook Wout',
          address: 'Enschede',
          image:
            'https://images.pexels.com/photos/2148217/pexels-photo-2148217.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=2&h=650&w=940',
          currentCredits: '8',
          goalCredits: '4000',
        },
        {
          name: 'Renovatie Clubhuis2',
          address: 'ZTV, Zieuwent',
          image:
            'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500',
          currentCredits: '100',
          goalCredits: '200',
        },
        {
          name: 'Renovatie Clubhuis3',
          address: 'ZTV, Zieuwent',
          image:
            'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500',
          currentCredits: '100',
          goalCredits: '200',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.scrolling-wrapper-flexbox {
  overflow-x: auto;
  .item {
    flex: 0 0 auto;
  }
}
</style>
