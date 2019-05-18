<template>
  <div class="home">
    <Subject :subjectRef="subjectRef" v-for="subjectRef in subjectRefs" :key="subjectRef.id"></Subject>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Consts from '../libs/Consts';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import Subject from '@/components/Home/Subject.vue';

@Component({ components: { Subject } })
export default class Home extends Vue {
  public subjectRefs: firebase.firestore.QueryDocumentSnapshot[] = [];

  public created() {
    this.goToInputIfResume();
    this.getSubjectRefs();
  }

  private getSubjectRefs() {
    firebase.auth().onAuthStateChanged((user) => {
      const db = firebase.firestore();
      db.collection('users')
        .doc(user!.uid)
        .collection('subjects')
        .get()
        .then((snapshot) => {
          snapshot.forEach((elm) => {
            this.subjectRefs.push(elm);
          });
        });
    });
  }

  private goToInputIfResume() {
    firebase.auth().onAuthStateChanged((user) => {
      const db = firebase.firestore();
      db.collection('users')
        .doc(user!.uid)
        .collection('works')
        .doc(Consts.SUBJECT_RESUME_ID)
        .get()
        .then((snapshot) => {
          if (
            // sanpshotが存在する => 以前このページに訪れた
            snapshot.exists &&
            // snapShotがstartしている => ストップウォッチを以前開始した
            (snapshot.data()!.isStart ||
              // snapShotがundefinedではない
              (snapshot.data()!.decidedTime &&
                // かつdecidedTimeが0ではない => ストップウォッチを以前止めた
                snapshot.data()!.decidedTime !== 0))
          ) {
            this.$router.push({ name: 'summary-input' });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}
</script>
