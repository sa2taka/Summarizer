<template>
  <div class="subject">
    {{subjectRef.id}}: {{resultTime}}
    <ChartRenderer :chartData="chartData" :option="chartOptions" v-if="canRender"></ChartRenderer>
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

  public chartOptions(): Chart.ChartOptions {
    return {
      legend: {
        display: false,
      },
    };
  }

  private getSummaryData(results: Map<string, number>): Chart.ChartData {
    return {
      labels: [...results.keys()],
      datasets: [
        {
          label: 'Data One',
          borderColor: '#009688',
          backgroundColor: '#8BCFC8',
          pointStyle: 'circle',
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
