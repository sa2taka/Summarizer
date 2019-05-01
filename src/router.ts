import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Signin from './views/Signin.vue';
import SummaryInput from './views/SummaryInput.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/input',
      name: 'summary-input',
      component: SummaryInput,
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin,
    },
  ],
});
