<template>
  <div class="stopwatch stopwatch-area">
    <div class="display-watch">00：00</div>

    <div class="button-area">
      <v-btn fab outline dark large color="teal" @click="clickedAddSubject">
        <div class="button-text">Start</div>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
@Component
export default class Stopwatch extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.stopwatch-area {
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: center;
  text-align: center;
  width: 100%;
}

.display-watch {
  font-size: 64px;
  margin: 12px 0;
}

.button-area {
  width: 100%;
}
.button-text {
  color: white;
}
</style>
