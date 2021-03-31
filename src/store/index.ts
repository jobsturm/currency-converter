import Vue from 'vue';
import Vuex, { ActionTree, MutationTree, GetterTree } from 'vuex';
import ForeignExchangeInterface from '@/Interfaces/ForeignExchangeInterface';

Vue.use(Vuex);

interface stateInterface {
  foreignExchange: ForeignExchangeInterface|null,
  conversionAmount: number,
  requestError: string|null,
}

const baseState:stateInterface = {
  foreignExchange: null,
  // The number globally used for conversion, in Euro cents
  conversionAmount: 0,
  requestError: null,
};

const mutations:MutationTree<stateInterface> = {
  setForeignExchange(state, foreignExchange):void {
    Vue.set(state, 'foreignExchange', foreignExchange);
  },
  setConversionAmount(state:stateInterface, amount:number):void {
    state.conversionAmount = amount;
  },
  setRequestError(state:stateInterface, errorMessage:string):void {
    state.requestError = errorMessage;
  },
};

const actions:ActionTree<stateInterface, stateInterface> = {
  async getForeignExchange({ commit }):Promise<void> {
    const response = await fetch('https://api.exchangeratesapi.io/latest');
    if (!response.ok) {
      commit('setRequestError', response.statusText);
      return;
    }
    const foreignExchange:ForeignExchangeInterface = await response.json();
    commit('setForeignExchange', foreignExchange);
  },
};

const getters:GetterTree<stateInterface, stateInterface> = {
  availableCurrencies({ foreignExchange }):Array<string> {
    if (!foreignExchange) return [];
    return [foreignExchange.base, ...Object.keys(foreignExchange.rates)];
  },
};

export {
  stateInterface,
  baseState,
  mutations,
  actions,
  getters,
};

export default new Vuex.Store({
  state: baseState,
  mutations,
  actions,
  getters,
});
