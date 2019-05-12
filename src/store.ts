import Vue from 'vue';
import Vuex from 'vuex';
import { DisplaiedEvent } from './libs/DisplaiedEvent';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    events: new Array<DisplaiedEvent>(),
  },
  mutations: {
    pushEvent(state, event: DisplaiedEvent) {
      state.events.push(event);
    },
    shiftEvent(state) {
      const _ = state.events.shift();
    },
  },
  actions: {
    pushEvent({ commit }, event) {
      commit('pushEvent', event);
    },
    shiftEvent({ commit }) {
      commit('shiftEvent');
    },
  },
});
