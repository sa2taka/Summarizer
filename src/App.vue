<template>
  <v-app dark>
    <Navbar></Navbar>

    <v-content grid-list-md text-xs-center class="main-container">
      <EventAlarts></EventAlarts>
      <div class="empty"></div>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/App/Navbar.vue';
import EventAlarts from '@/components/App/EventAlarts.vue';
import { DisplaiedEvent, EventType } from './libs/DisplaiedEvent';

@Component({
  components: {
    Navbar,
    EventAlarts,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
.main-container {
  position: relative;
  width: 80%;
  left: 10%;
}

.empty {
  height: 32px;
}
</style>
