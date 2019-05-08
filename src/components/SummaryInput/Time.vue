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
                v-model="date"
                label="Study Date"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
          </v-menu>
        </v-flex>
      </div>

      <transition name="slide-fade">
        <Manual class="time-input-content" v-show="bottomNav === manual" @input="onInputTime"></Manual>
      </transition>
      <transition name="slide-fade">
        <Stopwatch
          class="time-input-content"
          v-show="bottomNav === stopwatch"
          @input="onInputTime"
        >stopwatch</Stopwatch>
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import Manual from '@/components/SummaryInput/Manual.vue';
import Stopwatch from '@/components/SummaryInput/Stopwatch.vue';

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
  public studyTime = 0;
  public date = new Date().toISOString().substr(0, 10);
  public menu = false;

  public get manual(): string {
    return TimeType.manual;
  }

  public get stopwatch(): string {
    return TimeType.stopwatch;
  }

  public onInputTime(value: number) {
    this.studyTime = value;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.time-input-area {
  min-height: 320px;
}

.date-input-content {
  position: relative;
  padding: 0 40px 0 0;
  margin: 0 auto;
  width: 420px;
}

.time-input-content {
  position: absolute;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter {
  transform: translateX(-100px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
