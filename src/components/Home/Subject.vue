<template>
  <div class="subject">{{subjectRef.id}}: {{resultTime}}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component
export default class Home extends Vue {
  public resultTime: string = '';
  @Prop({ required: true })
  public subjectRef!: firebase.firestore.QueryDocumentSnapshot;

  public created() {
    this.subjectRef.ref
      .collection('results')
      .get()
      .then((snapshot) => {
        let sum = 0;
        snapshot.forEach((elm) => {
          sum += elm.data()!.time;
        });
        this.resultTime = String(sum);
      });
  }
}
</script>
