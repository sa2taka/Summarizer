<template>
  <div class="summary-input">
    <Subject v-model="selectedSubject"></Subject>
    <Time :date="date" @input-time="atInputTime" @input-date="atInputDate"></Time>

    <div class="add-summary-button-area">
      <!--
        dialogの部分はNavBarの部分と同じ
        コンポーネントを分けようとも思ったが、結局ボタンの部分が内部に入ってきてしまうため一旦断念
        何個か同じような処理が必要になったらさすがにコンポーネント化する
      -->
      <v-dialog v-model="showDialog" persistent max-width="290">
        <template v-slot:activator="{ on }">
          <v-btn
            id="subject-add-button"
            dark
            large
            color="red"
            class="add-summary-button"
            @click="showDialog = true"
          >
            <v-icon x-large dark>clear</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Are you syre?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="showDialog = false">Disagree</v-btn>
            <v-btn color="green darken-1" flat @click="clearSummary">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn
        id="subject-add-button"
        dark
        large
        color="blue"
        class="add-summary-button"
        @click="addSummary"
      >
        <v-icon x-large dark>edit</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';
import { DisplaiedEvent, EventType } from '../libs/DisplaiedEvent';
import Time from '@/components/SummaryInput/Time.vue';
import Subject from '@/components/SummaryInput/Subject.vue';
import * as Consts from '../libs/Consts';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component({
  components: {
    Time,
    Subject,
  },
})
export default class SummaryInput extends Vue {
  public selectedSubject: string = '';
  public date: string = new Date().toISOString().substr(0, 10);
  public time: number = 0;
  public showDialog: boolean = false;

  @Watch('selectedSubject')
  public onChangeSubject() {
    if (!this.selectedSubject) {
      return;
    }
    this.subjectResumeDoc.update({
      subject: this.selectedSubject,
    });
  }

  @Watch('date')
  public onChange() {
    this.subjectResumeDoc.update({ date: this.date });
  }

  public created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.subjectResumeDoc
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
            const data = snapshot.data()!;
            this.selectedSubject = data.subject;
            this.date = data.date;
            this.$store.dispatch(
              'pushEvent',
              new DisplaiedEvent('Previous input data found.', EventType.Info)
            );
          } else {
            this.subjectResumeDoc.set({
              date: this.date,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  public get subjectResumeDoc() {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
    return db
      .collection('users')
      .doc(user!.uid)
      .collection('works')
      .doc(Consts.SUBJECT_RESUME_ID);
  }

  public atInputDate(value: string) {
    this.date = value;
  }

  public atInputTime(value: number) {
    this.time = value;
  }

  public addSummary() {
    if (this.time === 0) {
      this.$store.dispatch(
        'pushEvent',
        new DisplaiedEvent(
          'Result time must be greater than 0',
          EventType.Error
        )
      );
      return;
    }
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
    const subjectDoc = db
      .collection('users')
      .doc(user!.uid)
      .collection('subjects')
      .doc(this.selectedSubject);
    const resultDoc = subjectDoc.collection('results').doc(this.date);

    resultDoc
      .get()
      .then((doc) => {
        if (doc.exists) {
          return resultDoc.update({
            time: doc.data()!.time + this.time,
          });
        } else {
          return resultDoc.set({
            time: this.time,
          });
        }
      })
      .then(() => {
        return subjectDoc.update({
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
      .then(() => {
        return this.subjectResumeDoc.delete();
      })
      .then(() => {
        this.$store.dispatch(
          'pushEvent',
          new DisplaiedEvent('Success in saving', EventType.Success)
        );
        this.$router.push({ name: 'home' });
      })
      .catch((error) => {
        this.$store.dispatch(
          'pushEvent',
          new DisplaiedEvent(
            `Something error occured.Check at Developer Tool Console.(${error})`,
            EventType.Error
          )
        );
        console.log(error);
      });
  }

  public clearSummary() {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
    const subjectDoc = db
      .collection('users')
      .doc(user!.uid)
      .collection('subjects')
      .doc(this.selectedSubject);
    const resultDoc = subjectDoc.collection('results').doc(this.date);

    this.subjectResumeDoc
      .delete()
      .then(() => {
        this.$router.push({ name: 'home' });
      })
      .catch((error) => {
        this.$store.dispatch(
          'pushEvent',
          new DisplaiedEvent(
            `Something error occured.Check at Developer Tool Console.(${error})`,
            EventType.Error
          )
        );
        console.log(error);
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.add-summary-button-area {
  position: relative;
  display: flex;
  width: 100%;
  margin: 32px 0;
  justify-content: center;
}

.add-summary-button {
  height: calc(2em + 24px);
  position: relative;
  width: 20%;
  min-width: 160px;
  left: 0;
  right: 0;
  margin: 12px;
}
</style>
