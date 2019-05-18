<template>
  <ChartRenderer :chartData="chartData" :options="chartOptions"></ChartRenderer>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import Chart from 'chart.js';
import ChartRenderer from '@/components/Common/Chart.vue';

@Component({ components: { ChartRenderer } })
export default class Detail extends Vue {
  public subjectRef!: firebase.firestore.DocumentSnapshot;

  @Prop({ required: true })
  public data!: Map<string, number>;
  public chartData: Chart.ChartData = {};

  @Watch('data')
  public upadteChartData() {
    this.chartData = this.getSummaryData(this.data);
  }

  public get chartOptions(): Chart.ChartOptions {
    return {
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad',
      },
      scales: {
        xAxes: [{}],
        yAxes: [
          {
            ticks: {
              min: 0,
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
          label: 'Result[m]',
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
}
</script>
