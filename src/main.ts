import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import * as firebase from 'firebase/app';
import Chart from 'chart.js';

Vue.config.productionTip = false;

Chart.defaults.global.defaultFontColor = '#b0b0b0';

const config = {
  apiKey: 'AIzaSyCYY4XQDVNtw87M2-MRBy2xHY9nap244O8',
  authDomain: 'summrizer.firebaseapp.com',
  databaseURL: 'https://summrizer.firebaseio.com',
  projectId: 'summrizer',
  storageBucket: 'summrizer.appspot.com',
  messagingSenderId: '485910235905',
};
firebase.initializeApp(config);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
