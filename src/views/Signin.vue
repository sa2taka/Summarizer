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
import 'firebase/firestore';

@Component
export default class Signin extends Vue {
  public gotoLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        if (result.user) {
          const db = firebase.firestore();
          db.collection('users')
            .doc(result.user.uid)
            .set({
              name: result.user.displayName,
            });
          this.$router.push({ name: 'home' });
        }
      });
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
