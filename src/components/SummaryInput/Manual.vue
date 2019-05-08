<template>
  <div class="manual manual-time-area">
    <v-flex justify-center align-center>
      <div class="manual-time-input">
        <v-select :items="hours" v-model="hour" label="hour" append-icon class="selected-center"></v-select>
        <p class="time-colon">:</p>
        <v-select
          :items="minutes"
          v-model="minute"
          label="minute"
          append-icon
          class="selected-center"
        ></v-select>
      </div>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
@Component
export default class Manual extends Vue {
  // 0から23までの数字の配列を作る
  public hours = [...Array(24).keys()];
  // 上と同様に0から59までの数字の配列をつくる
  public minutes = [...Array(60).keys()];

  public hour = 0;
  public minute = 0;

  public get studyTime(): number {
    return this.hour * 60 + this.minute;
  }

  @Emit()
  public input(value: number) {}

  @Watch('studyTime')
  public changedStudyTime() {
    this.input(this.studyTime);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.time-colon {
  font-size: 32px;
  margin: 4px 8px;
}

.manual-time-area {
  position: relative;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
}

.manual-time-input {
  width: 320px;
  margin: 80px auto;
  display: flex;
}

// v-selectのhack
.selected-center .v-select__selection {
  width: 100%;
  justify-content: center;
  font-size: 32px;
}
</style>
