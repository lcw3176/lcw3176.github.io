<template>
  <v-container>

    <v-row dense>
      <v-col cols="10">
        <v-text-field label="keyword" hide-details="auto" v-model="searchStore.keyword">

        </v-text-field>

      </v-col>

      <v-col cols="2">
        <v-btn type="submit" icon="mdi-magnify" @click="searchStore.search()">
        </v-btn>
      </v-col>
    </v-row>


    <v-card class="mx-auto">

      <v-list select-strategy="classic"
      :items="searchStore.items"
      item-props
      lines="three"
      @click="searchStore.download({ value })">
      
      <template v-slot:prepend>
          <v-avatar size="80">
          </v-avatar>
        </template>

      <template v-slot:subtitle="{ subtitle }">
        <div v-html="subtitle"></div>
      </template>
      </v-list>
    </v-card>
  </v-container>

  <!-- <InfiniteLoading @infinite="searchStore.infiniteHandler" v-if="searchStore.items.length != 0"/> -->
</template>

<script>

import { useSearchStore } from '@/store/search'
// import InfiniteLoading from 'v3-infinite-loading';

export default {
  name: 'Search',
  
  // components : {
  //   InfiniteLoading,
  // },

  setup() {
    const searchStore = useSearchStore()

    return {
      searchStore
    }
  },


}

</script>
