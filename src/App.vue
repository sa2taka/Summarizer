<template>
  <v-app dark>
    <v-toolbar app>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat to="/">Home</v-btn>
        <v-btn flat to="/input">Input</v-btn>

        <v-dialog v-model="signoutDialog" persistent max-width="290" v-if="isSignedIn">
          <template v-slot:activator="{ on }">
            <v-btn flat dark v-on="on">Signout</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">Are you syre?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="signoutDialog = false">Disagree</v-btn>
              <v-btn color="green darken-1" flat @click="signout">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn flat to="/signin" v-else>Singin</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content grid-list-md text-xs-center class="main-container">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component
export default class App extends Vue {
  public isSignedIn: boolean = false;
  public signoutDialog: boolean = false;
  public created() {
    firebase.auth().onAuthStateChanged((user) => {
      // !!をやると、すべての値がbooleanになる
      this.isSignedIn = !!user;
    });

    window.addEventListener('click', () => {
      this.signoutDialog = false;
    });
  }

  public signout() {
    this.signoutDialog = true;
    firebase.auth().signOut();
  }
}
</script>

<style lang="scss">
.main-container {
  position: relative;
  width: 80%;
  left: 10%;
}
</style>
