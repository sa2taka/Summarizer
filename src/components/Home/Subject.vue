<template>
  <v-card class="subject">
    <v-card-title primary-title class="title-grid">
      <div class="subject-title">{{subjectRef.id}}</div>
    </v-card-title>

    <v-card-text class="result-grid">
      <div class="result-time">total: {{formatTime(resultTime)}}</div>
    </v-card-text>

    <div class="button-grid">
      <v-btn
        fab
        dark
        small
        depressed
        color="teal"
        @click="$router.push({ name: 'summary-input', query: { subject: subjectRef.id }})"
      >
        <v-icon dark>edit</v-icon>
      </v-btn>

      <v-btn fab dark small depressed color="blue" @click="true">
        <v-icon dark>list_alt</v-icon>
      </v-btn>

      <v-dialog v-model="clearSubjectDialog" persistent max-width="290">
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            dark
            small
            depressed
            color="red"
            class="clear-subject-button"
            @click="clearSubjectDialog = true"
          >
            <v-icon dark>clear</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            Clear {{ subjectRef.id}} Subject.
            <br>Are you syre?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="clearSubjectDialog = false">Disagree</v-btn>
            <v-btn color="green darken-1" flat @click="clearSubject">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <transition name="bottom-to-top-slide">
      <ChartRenderer
        :chartData="chartData"
        :options="chartOptions"
        v-if="canRender"
        class="chart-grid"
      ></ChartRenderer>
    </transition>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DisplaiedEvent, EventType } from '../../libs/DisplaiedEvent';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import Chart from 'chart.js';

import ChartRenderer from '@/components/Common/Chart.vue';

@Component({
  components: {
    ChartRenderer,
  },
})
export default class Subject extends Vue {
  public resultTime: string = '';
  @Prop({ required: true })
  public subjectRef!: firebase.firestore.QueryDocumentSnapshot;

  public chartData!: Chart.ChartData;
  public canRender = false;
  public clearSubjectDialog = false;

  public async created() {
    window.addEventListener('click', ({ target }) => {
      // ボタンを押したときにisAddingValueがfalseになるため、
      // 祖先要素にsubject-add-buttonがあった場合はすぐにreturnする
      if (target!.closest('.clear-subject-button')) {
        return;
      }
      this.clearSubjectDialog = false;
    });

    const snapshot = await this.subjectRef.ref.collection('results').get();

    let sum = 0;
    const results = this.getInitializedResults();
    // resultsのkeysからなるArrayを生成
    const resultDates = [...results.keys()];
    snapshot.forEach((elm) => {
      const data = elm.data()!;
      sum += data.time;

      // elmが一ヶ月以内のデータなら
      if (resultDates.includes(elm.id)) {
        results.set(elm.id, data.time);
      }
    });
    this.resultTime = String(sum);
    this.chartData = this.getSummaryData(results);
    this.canRender = true;
  }

  public clearSubject() {
    this.subjectRef.ref.delete().then(() => {
      this.$router.go(0);
      this.$store.dispatch(
        'pushEvent',
        new DisplaiedEvent(
          `${this.subjectRef.id} Subject is Deleted.`,
          EventType.Success
        )
      );
    });
  }

  public get chartOptions(): Chart.ChartOptions {
    return {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad',
      },
      scales: {
        xAxes: [
          {
            display: false,
            ticks: {
              display: false,
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            display: false,
            ticks: {
              display: false,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    };
  }

  private getSummaryData(results: Map<string, number>): Chart.ChartData {
    return {
      labels: [...results.keys()],
      datasets: [
        {
          label: 'Result[m:]',
          borderColor: '#009688',
          pointBorderColor: '#00000000',
          pointBackgroundColor: '#00000000',
          pointStyle: 'circle',
          fill: false,
          data: [...results.values()],
        },
      ],
    };
  }

  private getInitializedResults(): Map<string, number> {
    const date: Date = new Date();
    const results: Map<string, number> = new Map<string, number>();

    date.setDate(date.getDate() - 30);

    for (let i = 0; i < 30; i++) {
      results.set(this.formatDate(date), 0);
      date.setDate(date.getDate() + 1);
    }

    return results;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear().toString();
    const month = this.putZeroPrefix((date.getMonth() + 1).toString(), 2);
    const day = this.putZeroPrefix(date.getDate().toString(), 2);
    return `${year}-${month}-${day}`;
  }

  private formatTime(time: number): string {
    const hour = `${Math.floor(time / 60)}`;
    const minute = this.putZeroPrefix(`${time % 60}`, 2);

    return `${hour}：${minute}`;
  }

  private putZeroPrefix(str: string, length: number): string {
    return ('00' + str).slice(-length);
  }
}
</script>

<style lang="scss" scoped>
.subject {
  display: grid;
  grid-template-rows: 80px 80px;
  grid-template-columns: 30% 30% 1fr;
  margin: 20px;
}

.title-grid {
  grid-row: 1 / 2;
  grid-column: 1 / 3;
}

.subject-title {
  font-size: 24px;
  white-space: nowrap;
}

.result-grid {
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  height: 100%;
  width: 100%;
  margin: 0 0;
}

.result-time {
  color: #afafaf;
  position: relative;
  font-size: 18px;
  margin: 12px;
  right: 0;
  margin: 12px 0 12px 0;
}

.button-grid {
  grid-row: 1 / 2;
  grid-column: 3 / 4;
  margin: auto 5% auto auto;
}

.chart-grid {
  position: relative;
  grid-row: 2 / 3;
  grid-column: 2 / 4;
  margin: 6px 12px;
  padding: 6px 0;
}

bottom-to-top-slide-enter-active,
.bottom-to-top-slide-leave-active {
  transition: opacity 0.5s;
}

.bottom-to-top-slide-leave-to,
.bottom-to-top-slide-enter {
  opacity: 0;
}
</style>
