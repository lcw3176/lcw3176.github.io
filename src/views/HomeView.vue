<template>
    <v-app-bar
      dark
      :elevation="1"
    >
      <v-toolbar-title class="font-weight-black">Youtube Hi</v-toolbar-title>

      <v-spacer></v-spacer>

    </v-app-bar>

  <search/>

</template>

<script>
import Search from '@/components/Search.vue'

export default {
  components: { Search },
  name: 'HomeView',

  setup () {

  }

}
</script>
