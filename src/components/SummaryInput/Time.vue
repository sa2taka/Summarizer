<template>
  <div class="time">
    <div class="time-input-area">
      <div class="date-input-content">
        <v-flex justify-center align-center>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="30"
            lazy
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="date"
                label="Study Date"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker :value="date" @input="onInputDate"></v-date-picker>
          </v-menu>
        </v-flex>
      </div>

      <transition name="slide-fade">
        <div class="material-surface elevation-2" v-show="bottomNav === manual">
          <Manual class="time-input-content" @input="onManualInputTime"></Manual>
        </div>
      </transition>
      <transition name="slide-fade">
        <div class="material-surface elevation-2" v-show="bottomNav === stopwatch">
          <Stopwatch class="time-input-content" @input="onStopWatchInputTime">stopwatch</Stopwatch>
        </div>
      </transition>
    </div>

    <v-bottom-nav :active.sync="bottomNav" :value="true" color="transparent">
      <v-btn color="teal" flat value="manual">
        <span>Manual</span>
        <v-icon>create</v-icon>
      </v-btn>
      <v-btn color="teal" flat value="stopwatch">
        <span>Stopwatch</span>
        <v-icon>alarm</v-icon>
      </v-btn>
    </v-bottom-nav>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from 'vue-property-decorator';
import Manual from '@/components/SummaryInput/Manual.vue';
import Stopwatch from '@/components/SummaryInput/Stopwatch.vue';
import * as Consts from '../../libs/Consts';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

enum TimeType {
  manual = 'manual',
  stopwatch = 'stopwatch',
}
@Component({
  components: {
    Manual,
    Stopwatch,
  },
})
export default class Time extends Vue {
  public bottomNav = TimeType.manual;
  @Prop({ required: true })
  public date!: string;
  public menu = false;
  private manualTime: number = 0;
  private stopwatchTime: number = 0;

  @Emit('input-time')
  public inputTime(value: number) {}

  @Emit('input-date')
  public inputDate(value: string) {}

  @Watch('bottomNav')
  public onChangeBottomNav() {
    switch (this.bottomNav) {
      case this.manual:
        this.inputTime(this.manualTime);
        break;
      case this.stopwatch:
        this.inputTime(this.stopwatchTime);
        break;
      default:
        break;
    }
  }

  public get manual(): string {
    return TimeType.manual;
  }

  public get stopwatch(): string {
    return TimeType.stopwatch;
  }

  public created() {
    firebase.auth().onAuthStateChanged((user) => {
      const db = firebase.firestore();
      db.collection('users')
        .doc(user!.uid)
        .collection('works')
        .doc(Consts.SUBJECT_RESUME_ID)
        .get()
        .then((snapshot) => {
          const data = snapshot.data()!;
          if (snapshot.exists && (data.decidedTime || data.decidedTime === 0)) {
            this.bottomNav = TimeType.stopwatch;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  public onManualInputTime(value: number) {
    this.manualTime = value;
    if (this.bottomNav === this.manual) {
      this.inputTime(value);
    }
  }

  public onStopWatchInputTime(value: number) {
    this.stopwatchTime = value;
    if (this.bottomNav === this.stopwatch) {
      this.inputTime(value);
    }
  }

  public onInputDate(value: string) {
    this.inputDate(value);
    this.menu = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.time-input-area {
  min-height: 300px;
}

.date-input-content {
  position: relative;
  padding: 0 40px 0 0;
  margin: 0 auto;
  width: 320px;
}

.slide-fade-enter-active {
  transition: transform 0.6s ease, opacity 0.3s ease-out 0.2s;
}

.slide-fade-leave-active {
  transition: transform 0.6s ease, opacity 0.2s ease-in;
}

.slide-fade-leave-to,
.slide-fade-enter {
  transform: rotateY(180deg);
  opacity: 0;
}

.material-surface {
  position: absolute;
  height: 220px;
  width: 220px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: #343434;
  border-radius: 50%;
}
</style>
