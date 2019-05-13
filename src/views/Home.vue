<template>
  <div class="home">Home</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Consts from '../libs/Consts';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component
export default class Home extends Vue {
  public created() {
    this.goToInputIfResume();
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
              // decidedTimeが0ではない => ストップウォッチを以前止めた
              snapshot.data()!.decidedTime !== 0)
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
