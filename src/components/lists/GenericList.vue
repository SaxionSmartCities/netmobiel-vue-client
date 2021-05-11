<template>
  <v-row v-if="items.length > 0">
    <v-col>
      <v-row v-for="(item, index) in items" :key="index">
        <v-col class="pt-0">
          <v-divider class="pb-3" />
          <slot name="list-item" :item="item" :index="index"></slot>
        </v-col>
      </v-row>
      <v-divider />
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col>
      <span class="empty-list">{{ emptyListLabel }}</span>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'GenericList',
  props: {
    items: { type: Array, required: true },
    emptyListLabel: { type: String, required: true },
  },
}
</script>

<style scoped>
.empty-list {
  font-style: italic;
}
</style>
