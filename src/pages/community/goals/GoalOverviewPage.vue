<template xmlns:display="http://www.w3.org/1999/xhtml">
  <content-pane>
    <v-row mb-3>
      <h1>Doelen</h1>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row mt-6>
      <v-text-field
        outlined
        label="zoeken"
        prepend-inner-icon="search"
      ></v-text-field>
    </v-row>
    <v-row mb-3 mt-3>
      <span class="font-weight-medium primary--text"
        >Populair in de buurt
      </span>
    </v-row>
    <v-row>
      <goal-card></goal-card>
    </v-row>
    <v-row mb-3 mt-3>
      <span class="font-weight-medium primary--text">Eerder gedoneerd </span>
    </v-row>
    <v-row>
      <v-slide-group multiple center-active>
        <v-slide-item
          v-for="n in 25"
          :key="n"
          v-slot:default="{ active, toggle }"
        >
          <goal-card></goal-card>
        </v-slide-item>
      </v-slide-group>
    </v-row>
    <v-row mb-3 mt-3>
      <span class="font-weight-medium primary--text">Top donateurs</span>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-list-item-avatar tilesize="100" color="grey"></v-list-item-avatar>
      </v-col>
      <v-col>
        <v-row>
          <span class="subtitle-2 text-no-wrap pr-2"
            >Hendrik van der laan
          </span>
        </v-row>
        <v-row>
          <span class="overline">793 credits gedoneerd</span>
        </v-row>
      </v-col>
      <v-col>
        <v-btn rounded color="button" dark>
          <v-icon>fa-user-plus</v-icon></v-btn
        ></v-col
      >
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-list-item-avatar tilesize="100" color="grey"></v-list-item-avatar>
      </v-col>
      <v-col>
        <v-row>
          <span class="subtitle-2 text-no-wrap pr-2">Marc de Vries </span>
        </v-row>
        <v-row>
          <span class="overline">323 credits gedoneerd</span>
        </v-row>
      </v-col>
      <v-col>
        <v-btn rounded color="button" dark>
          <v-icon>fa-user-plus</v-icon></v-btn
        ></v-col
      >
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-list-item-avatar tilesize="100" color="grey"></v-list-item-avatar>
      </v-col>
      <v-col>
        <v-row>
          <span class="subtitle-2 text-no-wrap pr-2">Coby Hoekstra </span>
        </v-row>
        <v-row>
          <span class="overline">123 credits gedoneerd</span>
        </v-row>
      </v-col>
      <v-col>
        <v-btn rounded color="button" dark>
          <v-icon>fa-user-plus</v-icon></v-btn
        ></v-col
      >
    </v-row>
  </content-pane>
</template>

<script>
import GoalCard from '../../../components/community/GoalCard'
import ContentPane from '../../../components/common/ContentPane'
export default {
  name: 'GoalOverviewPage',
  components: { ContentPane, GoalCard },
  data: function() {
    return {}
  },
}
</script>

<style lang="scss"></style>
