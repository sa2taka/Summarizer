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
import { DisplaiedEvent, EventType } from '../../libs/DisplaiedEvent';
import * as Consts from '../../libs/Consts';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component
export default class Stopwatch extends Vue {
  public displayTime = '00：00：00';
  private startTime: number = 0;
  private decidedTime: number = 0;
  private isStart: boolean = false;

  public created() {
    firebase.auth().onAuthStateChanged((user) => {
      const workRef = this.getWorkRef();
      workRef
        .doc(Consts.SUBJECT_RESUME_ID)
        .get()
        .then((snapshot) => {
          if (!snapshot.exists) {
            return;
          }

          const data = snapshot.data()!;
          if (!data.decidedTime && data.decidedTime !== 0) {
            return;
          }
          this.startTime = data.isStart ? data!.startTime : 0;
          this.isStart = data.isStart;
          this.decidedTime = data.decidedTime;
        })
        .catch((error) => {
          console.log(error);
        });
      this.updateWatch();
    });
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

  @Watch('displayTime')
  public onChangeTime() {
    const time = this.selectTime();
    this.input(this.changeToMinute(time));
  }

  private startWatch() {
    this.isStart = true;
    this.startTime = Date.now();
    const workRef = this.getWorkRef();

    // 上位ロジックで必ずこのIDのdocが存在することを前提としている
    // こういうのをVuexの管理下においたほうがいいのかも知れない
    workRef.doc(Consts.SUBJECT_RESUME_ID).update({
      isStart: true,
      startTime: this.startTime,
      decidedTime: this.decidedTime,
    });
  }

  private stopWatch() {
    this.isStart = false;
    this.decidedTime += Date.now() - this.startTime;
    const workRef = this.getWorkRef();

    // 上位ロジックで必ずこのIDのdocが存在することを前提としている
    workRef.doc(Consts.SUBJECT_RESUME_ID).update({
      isStart: false,
      decidedTime: this.decidedTime,
    });
  }

  private updateWatch() {
    setTimeout(this.updateWatch, 200);
    const time = this.selectTime();

    this.displayTime = this.formatTime(time);
  }

  private selectTime(): number {
    const pausedTime = Number(this.decidedTime / 1000);
    const activeTime = Number(
      (Date.now() - this.startTime + this.decidedTime) / 1000
    );

    return this.isStart ? activeTime : pausedTime;
  }

  private formatTime(time: number): string {
    const hour = `${Math.floor((time / 3600) % 24)}`;
    const minute = `${Math.floor((time / 60) % 60)}`;
    const seconds = `${Math.floor(time % 60)}`;

    return `${this.putZeroPrefix(hour, 2)}：${this.putZeroPrefix(
      minute,
      2
    )}：${this.putZeroPrefix(seconds, 2)}`;
  }

  // FIXME: getWorkRefはSubject.vueでも定義されている、どこかmoduleとして抜き出したい
  private getWorkRef() {
    const user = firebase.auth().currentUser;
    if (!user) {
      this.$store.dispatch(
        'pushEvent',
        new DisplaiedEvent('Require Authentication', EventType.Error)
      );
      this.$router.push({ name: 'signin' });
    }

    const db = firebase.firestore();
    const workRef = db
      .collection('users')
      .doc(user!.uid)
      .collection('works');

    return workRef;
  }

  private putZeroPrefix(str: string, length: number) {
    return ('0' + str).slice(-length);
  }

  private changeToMinute(time: number): number {
    return (Math.floor(time / 3600) % 24) * 60 + Math.floor((time / 60) % 60);
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
  margin: auto;
  width: 100%;
  height: 100%;
}

.display-watch {
  font-size: 44px;
  margin: 12px 0;
}

.button-area {
  width: 100%;
}
.button-text {
  color: white;
}
</style>
