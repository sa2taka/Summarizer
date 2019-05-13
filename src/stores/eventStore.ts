import { DisplaiedEvent } from '../libs/DisplaiedEvent';

export default {
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
};
