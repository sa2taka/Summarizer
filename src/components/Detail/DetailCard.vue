<template>
  <v-card class="detail-card">
    <div class="date">{{date}}</div>
    <div class="time">
      <v-icon dark>access_time</v-icon>
      {{formatTime(time)}}
    </div>
    <div>
      <v-dialog v-model="clearResultDialog" persistent max-width="290">
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            dark
            small
            depressed
            color="red"
            class="clear-result-button"
            @click="clearResultDialog = true"
          >
            <v-icon dark>clear</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Are you syre?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="clearResultDialog = false">Disagree</v-btn>
            <v-btn color="green darken-1" flat @click="clearResult">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import { DisplaiedEvent, EventType } from '../../libs/DisplaiedEvent';
import 'firebase/firestore';
import 'firebase/auth';

@Component
export default class DetailCard extends Vue {
  public clearResultDialog = false;

  @Prop({ required: true })
  public date!: string;
  @Prop({ required: true })
  public time!: string;

  public created() {
    window.addEventListener('click', ({ target }) => {
      // ボタンを押したときにisAddingValueがfalseになるため、
      // 祖先要素にsubject-add-buttonがあった場合はすぐにreturnする
      if (target!.closest('.clear-result-button')) {
        return;
      }
      this.clearResultDialog = false;
    });
  }

  public clearResult() {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();

    db.collection('users')
      .doc(user!.uid)
      .collection('subjects')
      .doc(this.$route.params['subject'])
      .collection('results')
      .doc(this.date)
      .delete()
      .then(() => {
        this.$router.go(0);
        this.$store.dispatch(
          'pushEvent',
          new DisplaiedEvent('Result is deleted', EventType.Success)
        );
      });
  }

  private putZeroPrefix(str: string, length: number): string {
    return ('00' + str).slice(-length);
  }

  private formatTime(time: number): string {
    const hour = `${Math.floor(time / 60)}`;
    const minute = this.putZeroPrefix(`${time % 60}`, 2);

    return `${hour}：${minute}`;
  }
}
</script>

<style lang="scss" scoped>
.detail-card {
  margin: 12px;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  text-align: center;
  padding: 8px;
}

.date {
  font-size: 18px;
  margin: auto 0;
}

.time {
  width: 40%;
  font-size: 16px;
  margin: auto 0;
}
</style>
