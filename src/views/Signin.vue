<template>
  <div class="signin">
    <strong class="display-1 my-3">You need signed in.</strong>
    <v-btn color="info" class="signin-button" @click="gotoLogin">Authentication via google</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component
export default class Signin extends Vue {
  gotoLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }
}
</script>

<style scoped lang="scss">
.signin {
  display: flex;
  position: relative;
  justify-content: center;
  text-align: center;
  flex-flow: column;
}

.signin-button {
  width: 320px;
  position: relative;
  margin: 0 auto;
}
</style>
