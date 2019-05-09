<template>
  <div class="summary-input">
    <Subject v-model="selectedSubject"></Subject>
    <Time :date="date" @input-time="atInputTime" @input-date="atInputDate"></Time>

    <div class="add-summry-button">
      <v-btn
        id="subject-add-button"
        fab
        dark
        large
        color="orange"
        class="add-button"
        @click="addSummary"
      >
        <v-icon dark>add</v-icon>
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
          if (snapshot.exists) {
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
    console.log(this.selectedSubject);
    console.log(this.date);
    console.log(this.time);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
