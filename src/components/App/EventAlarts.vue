<template>
  <div class="alerts">
    <v-alert
      v-for="event in events"
      :key="event.content.displaied"
      :type="event.content.type"
      :value="event.isDisplaied"
      transition="fade-transition"
    >{{event.content.display}}</v-alert>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DisplaiedEvent, EventType } from '../../libs/DisplaiedEvent';
@Component
export default class EventAlart extends Vue {
  public events: any[] = [];
  public created() {
    this.$store.subscribeAction((action, state) => {
      if (action.type === 'pushEvent') {
        this.events.push({ content: action.payload, isDisplaied: true });
        const leastIndex = this.events.length - 1;
        setTimeout(() => {
          this.events[leastIndex].isDisplaied = false;
          this.$store.dispatch('shiftEvent');
        }, 3000);
        setTimeout(() => {
          this.events.shift();
        }, 6000);
      }
    });
  }
}
</script>

<style lang="scss">
.alerts {
  position: absolute;
  z-index: 99999;
  width: 100%;
  opacity: 0.9;
}
</style>
