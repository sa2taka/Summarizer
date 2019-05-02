<template>
  <v-app dark>
    <Navbar></Navbar>
    <v-content grid-list-md text-xs-center class="main-container">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/App/Navbar.vue';
@Component({
  components: {
    Navbar,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
.main-container {
  position: relative;
  width: 80%;
  left: 10%;
}
</style>
