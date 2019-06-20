<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <p class="headline">{{ title }}</p>
      </v-flex>
      <v-divider></v-divider>
      <v-flex mt-4>
        <v-text-field
          v-model="searchInput"
          outline
          prepend-inner-icon="search"
          clearable
          placeholder="Zoeken"
          class="border-radius-input"
          single-line
        ></v-text-field>
      </v-flex>
      <v-flex mb-3>
        <h1 class="font-weight-bold subheading mt-2">Gedoneerd</h1>
      </v-flex>
      <v-flex>
        <v-layout row class="scrolling-wrapper-flexbox">
          <goal-iteam
            v-for="i in goalItems"
            :key="i.name"
            :item="i"
            class="item"
            :donated-credits="i.donated"
          ></goal-iteam>
        </v-layout>
      </v-flex>
      <v-flex mb-3>
        <h1 class="font-weight-bold subheading mt-2">Populair in de buurt</h1>
      </v-flex>
      <v-flex>
        <v-layout row class="scrolling-wrapper-flexbox">
          <goal-iteam
            v-for="i in goalItems"
            :key="i.name"
            :item="i"
            class="item"
          ></goal-iteam>
        </v-layout>
      </v-flex>
      <v-flex mb-3>
        <h1 class="font-weight-bold subheading mt-2">Top donateurs</h1>
      </v-flex>
      <v-flex>
        <v-layout column>
          <v-flex>
            <v-list>
              <div v-for="user in userItems" :key="user.name" class="my-2">
                <v-divider></v-divider>
                <v-list-tile>
                  <v-list-tile-avatar>
                    <img :src="user.img" />
                  </v-list-tile-avatar>
                  <v-spacer></v-spacer>
                  <v-list-tile-content>
                    <v-layout column align-center>
                      <v-flex
                        ><h4>{{ user.name }}</h4></v-flex
                      >
                      <v-flex
                        ><div>
                          {{ user.donated }} credits gedoneerd.
                        </div></v-flex
                      >
                    </v-layout>
                  </v-list-tile-content>
                </v-list-tile>
              </div>
            </v-list>
          </v-flex>
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
      goalItems: [
        {
          name: 'Renovatie Clubhuis',
          address: 'ZTV, Zieuwent',
          image:
            'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500',
          currentCredits: '100',
          goalCredits: '200',
          donated: 20,
        },
        {
          name: 'Macbook Wout',
          address: 'Enschede',
          image:
            'https://images.pexels.com/photos/2148217/pexels-photo-2148217.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=2&h=650&w=940',
          currentCredits: '8',
          goalCredits: '4000',
          donated: 4,
        },
        {
          name: 'Renovatie Clubhuis2',
          address: 'ZTV, Zieuwent',
          image:
            'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500',
          currentCredits: '100',
          goalCredits: '200',
          donated: 45,
        },
        {
          name: 'Renovatie Clubhuis3',
          address: 'ZTV, Zieuwent',
          image:
            'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500',
          currentCredits: '100',
          goalCredits: '200',
          donated: 1,
        },
      ],
      userItems: [
        {
          name: 'Piet Jansen',
          img: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          donated: '55',
        },
        {
          name: 'Gerald visser',
          img: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          donated: '43',
        },
        {
          name: 'Lies Schukkink',
          img: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          donated: '19',
        },
        {
          name: 'Karen Leusink',
          img: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          donated: '18',
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
