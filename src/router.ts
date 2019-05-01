import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Signin from './views/Signin.vue';
import SummaryInput from './views/SummaryInput.vue';
import * as firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/input',
      name: 'summary-input',
      component: SummaryInput,
      meta: { requiresAuth: true },
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin,
      meta: { requiresNotSignedIn: true },
    },
  ],
});

// metaデータと認証の有無に応じてルートを変更する
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => {
    return record.meta.requireAuth;
  });
  const requiresNotSignedIn = to.matched.some((record) => {
    return record.meta.requiresNotSignedIn;
  });
  const user = firebase.auth().currentUser;

  if (user && requiresNotSignedIn) {
    next({
      path: '/',
      query: { redirect: to.fullPath },
    });
  } else if (!user && requiresAuth) {
    next({
      path: '/signin',
      query: { redirect: to.fullPath },
    });
  }

  next();
});

export default router;
