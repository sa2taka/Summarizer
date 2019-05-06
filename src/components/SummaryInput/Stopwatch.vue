<template>
  <div class="stopwatch stopwatch-area">
    <div class="display-watch">{{ displayTime }}</div>

    <div class="button-area">
      <v-btn fab outline dark large color="teal" @click="toggleWatch">
        <div class="button-text">{{isStart ? 'Pause' : 'Start'}}</div>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Watch, Vue } from 'vue-property-decorator';
import Time from './Time.vue';
@Component
export default class Stopwatch extends Vue {
  public displayTime = '00：00：00';
  private startTime: number = 0;
  private isStart: boolean = false;

  public created() {
    this.updateWatch();
  }

  @Emit()
  public input(value: number) {}

  public toggleWatch() {
    if (this.isStart) {
      this.stopWatch();
    } else {
      this.startWatch();
    }
  }

  private startWatch() {
    this.isStart = true;
    this.startTime = Date.now();
  }

  private stopWatch() {
    this.isStart = false;
  }

  private updateWatch() {
    setTimeout(this.updateWatch, 200);
    if (!this.isStart) {
      // ：は全角(見た目が特にスタイルを弄らなくても綺麗)
      return '00：00：00';
    }

    const diffSec = Number((Date.now() - this.startTime) / 1000);
    this.displayTime = this.formatTime(diffSec);
  }

  private formatTime(time: number): string {
    const hour = `${Math.round((time / 3600) % 24)}`;
    const minute = `${Math.round((time / 60) % 60)}`;
    const seconds = `${Math.round(time % 60)}`;

    return `${this.putZeroPrefix(hour, 2)}：${this.putZeroPrefix(
      minute,
      2
    )}：${this.putZeroPrefix(seconds, 2)}`;
  }

  private putZeroPrefix(str: string, length: number) {
    return ('0' + str).slice(-length);
  }
}
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
