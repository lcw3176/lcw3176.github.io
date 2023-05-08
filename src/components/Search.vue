<template>
    <v-container>

        <v-row dense>
            <v-col cols="10">
                <v-text-field label="keyword" hide-details="auto" 
                v-model="searchStore.keyword">

                </v-text-field>

            </v-col>

            <v-col cols="2">
                <v-btn type="submit" icon="mdi-magnify" @click="searchStore.search()">
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import { useSearchStore } from '@/store/search'

export default {
  name: 'Search',

  setup () {
    const searchStore = useSearchStore()

    return {
      searchStore
    }
  }

}

</script>
