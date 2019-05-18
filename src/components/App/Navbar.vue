<template>
  <div>
    <v-navigation-drawer v-model="sidebar" class="drawer" app>
      <v-list>
        <v-list-tile>
          <v-btn flat to="/">Home</v-btn>
        </v-list-tile>
        <v-list-tile>
          <v-btn flat to="/input">Input</v-btn>
        </v-list-tile>
        <v-list-tile>
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
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar"></v-toolbar-side-icon>
      </span>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component
export default class Navbar extends Vue {
  public isSignedIn: boolean = false;
  public signoutDialog: boolean = false;
  public sidebar = false;
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
    this.$router.push({ name: 'signin' });
  }
}
</script>

<style lang="scss">
.drawer {
  width: 200px !important;
}
</style>
