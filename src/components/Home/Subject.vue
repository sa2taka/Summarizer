<template>
  <div class="subject">
    {{subjectRef.id}}: {{resultTime}}
    <transition name="bottom-to-top-slide">
      <ChartRenderer :chartData="chartData" :options="chartOptions" v-if="canRender"></ChartRenderer>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
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

  public async created() {
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

  public get chartOptions(): Chart.ChartOptions {
    return {
      legend: {
        display: false,
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad',
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

  private putZeroPrefix(str: string, length: number): string {
    return ('0' + str).slice(-length);
  }
}
</script>

<style lang="scss" scoped>
.bottom-to-top-slide-enter-active,
.bottom-to-top-slide-leave-active {
  transition: opacity 0.5s;
}

.bottom-to-top-slide-leave-to,
.bottom-to-top-slide-enter {
  opacity: 0;
}
</style>
