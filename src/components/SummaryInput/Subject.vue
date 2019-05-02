<template>
  <div id="subject">
    <v-flex xs12 sm6 d-flex>
      <v-select
        v-model="selectedSubject"
        :items="displayItems"
        label="Subject"
        @input="changedValue"
      ></v-select>
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DisplaiedEvent, EventType } from '../../libs/DisplaiedEvent';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component
export default class Subject extends Vue {
  public itemValue: string = '';
  public isAddingValue: boolean = false;
  public selectedSubject: string = '';
  public inputSubject: string = '';
  public rules: any = {
    required: (value: string) => {
      return value.length > 0 || 'Required';
    },
  };
  @Prop({ required: true })
  public items!: string[];
  private AddValueText = 'Add New Subject';

  public created() {
    window.addEventListener('click', () => {
      this.isAddingValue = false;
    });
  }

  public get displayItems(): string[] {
    return this.items.concat([this.AddValueText]);
  }

  public changedValue(value: string) {
    if (value === this.AddValueText) {
      this.isAddingValue = true;
    }
  }

  private addValue() {
    if (this.inputSubject.length === 0) {
      return;
    }

    const user = firebase.auth().currentUser;

    if (!user) {
      this.$store.dispatch(
        'pushEvent',
        new DisplaiedEvent('Require Authentication', EventType.Error)
      );
    }

    const db = firebase.firestore();
    const subjectRef = db
      .collection('users')
      .doc(user!.uid)
      .collection('subjects')
      .add({
        name: this.inputSubject,
      })
      .then((e) => {
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.subject-input {
  width: 80%;
  margin: 0 20px;
}
</style>
