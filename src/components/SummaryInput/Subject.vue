<template>
  <div id="subject">
    <v-flex xs12 sm6 d-flex>
      <v-select :value="selectedSubject" @input="onSelectSubject" :items="items" label="Subject"></v-select>
      <div>
        <v-btn
          id="subject-add-button"
          fab
          dark
          small
          color="teal"
          class="add-button"
          @click="clickedAddSubject"
        >
          <v-icon dark>add</v-icon>
        </v-btn>
      </div>
    </v-flex>
    <v-dialog v-model="isAddingValue" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">New Subject</v-card-title>
        <v-text-field
          autofocus
          v-model="inputSubject"
          label="subject name"
          class="subject-input"
          :rules="[rules.required]"
          :error="inputSubject.length === 0"
          @keyup.enter="addValue"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="isAddingValue = false;">Cancel</v-btn>
          <v-btn color="green darken-1" flat @click="addValue">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Emit, Prop, Vue } from 'vue-property-decorator';
import { DisplaiedEvent, EventType } from '../../libs/DisplaiedEvent';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component
export default class Subject extends Vue {
  public items: string[] = [];
  public isAddingValue: boolean = false;
  public inputSubject: string = '';
  public rules: any = {
    required: (value: string) => {
      return value.length > 0 || 'Required';
    },
  };

  @Prop()
  public selectedSubject!: string;

  private AddValueText = 'Add New Subject';

  @Emit()
  public input(value: string) {}

  public created() {
    window.addEventListener('click', ({ target }) => {
      // ボタンを押したときにisAddingValueがfalseになるため、
      // 祖先要素にsubject-add-buttonがあった場合はすぐにreturnする
      if (target!.closest('#subject-add-button')) {
        return;
      }
      this.isAddingValue = false;
    });

    firebase.auth().onAuthStateChanged((user) => {
      const subjectRef = this.getSubjectRef();
      subjectRef
        .get()
        .then((snapshot) => {
          snapshot.forEach((elm) => {
            this.items.push(elm.id);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  public clickedAddSubject(value: string) {
    this.isAddingValue = true;
  }

  public onSelectSubject(value: string) {
    this.input(value);
  }

  private addValue() {
    if (this.inputSubject.length === 0) {
      return;
    }

    const db = firebase.firestore();
    const subjectRef = this.getSubjectRef();
    subjectRef
      .doc(this.inputSubject)
      .set({})
      .then((e) => {
        this.items.push(this.inputSubject);
        this.$store.dispatch(
          'pushEvent',
          new DisplaiedEvent('Success', EventType.Success)
        );
        this.isAddingValue = false;
      })
      .catch((error) => {
        console.log(error);
        this.$store.dispatch(
          'pushEvent',
          new DisplaiedEvent('Sorry, Something Error Occurred', EventType.Error)
        );
      });
  }

  private getSubjectRef() {
    const user = firebase.auth().currentUser;
    if (!user) {
      this.$store.dispatch(
        'pushEvent',
        new DisplaiedEvent('Require Authentication', EventType.Error)
      );
      this.$router.push({ name: 'signin' });
    }

    const db = firebase.firestore();
    const subjectRef = db
      .collection('users')
      .doc(user!.uid)
      .collection('subjects');

    return subjectRef;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.subject-input {
  width: 80%;
  margin: 0 20px;
}

.add-button {
  width: 48px;
  height: 48px;
}
</style>
