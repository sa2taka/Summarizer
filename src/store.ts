import Vue from 'vue';
import Vuex from 'vuex';
import event from './stores/eventStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    event,
  },
});
