<template>
  <div>
    <v-btn outline fab icpn dark small @click="$router.go(-1)">
      <v-icon dark>keyboard_backspace</v-icon>
    </v-btn>
    <h1 v-once class="detail-title">{{$route.params['subject']}}</h1>
    <DetailChart :data="subjectResults" class="detail-chart"></DetailChart>

    <DetailCard v-for="[key, value] in specifiedResults" :key="key" :date="key" :time="value"></DetailCard>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import Chart from 'chart.js';
import DetailChart from '@/components/Detail//DetailsChart.vue';
import DetailCard from '@/components/Detail/DetailCard.vue';

@Component({ components: { DetailChart, DetailCard } })
export default class Detail extends Vue {
  public subjectResults = this.getInitializedResults();
  public specifiedResults = new Map<string, number>();

  public created() {
    const results = this.getInitializedResults();
    // resultsのkeysからなるArrayを生成
    const resultDates = [...results.keys()];
    const specifiedResults = new Map<string, number>();

    firebase.auth().onAuthStateChanged((user) => {
      const db = firebase.firestore();
      db.collection('users')
        .doc(user!.uid)
        .collection('subjects')
        .doc(this.$route.params['subject'] as string)
        .collection('results')
        .get()
        .then((snapshot) => {
          snapshot.forEach((elm) => {
            const data = elm.data()!;
            specifiedResults.set(elm.id, data.time);
            if (resultDates.includes(elm.id)) {
              results.set(elm.id, data.time);
            }
          });
          this.specifiedResults = specifiedResults;
          this.subjectResults = results;
        });
    });
  }

  private getInitializedResults(): Map<string, number> {
    const date: Date = new Date();
    const results: Map<string, number> = new Map<string, number>();

    date.setDate(date.getDate() - 182);

    for (let i = 0; i < 182; i++) {
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
    return ('00' + str).slice(-length);
  }
}
</script>

<style lang="scss" scoped>
.detail-chart {
  margin: 24px;
  max-height: 300px;
}

.detail-title {
  margin: 10px 10%;
  width: 100%;
}
</style>
