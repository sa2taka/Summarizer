<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import Chart from 'chart.js';
import { Line, mixins } from 'vue-chartjs';

@Component
export default class ChartRenderer extends Mixins(Line, mixins.reactiveProp) {
  @Prop({ required: true })
  public chartData!: Chart.ChartData;
  @Prop()
  public options!: Chart.ChartOptions;

  public mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
</script>
