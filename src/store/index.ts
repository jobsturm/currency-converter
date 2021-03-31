import Vue from 'vue';
import Vuex from 'vuex';
import ForeignExchangeInterface from '@/Interfaces/ForeignExchangeInterface';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    foreignExchange: null as ForeignExchangeInterface|null,
    // The number globally used for conversion, in Euro cents
    conversionAmount: 0 as number,
    requestError: null as string|null,
  },
  mutations: {
    setForeignExchange(state, foreignExchange:ForeignExchangeInterface):void {
      Vue.set(state, 'foreignExchange', foreignExchange);
    },
    setConversionAmount(state, amount:number):void {
      state.conversionAmount = amount;
    },
    setRequestError(state, errorMessage:string):void {
      state.requestError = errorMessage;
    },
  },
  actions: {
    async getForeignExchange({ commit }):Promise<void> {
      const response = await fetch('https://api.exchangeratesapi.io/latest');
      if (!response.ok) {
        commit('setRequestError', response.statusText);
        return;
      }
      const foreignExchange:ForeignExchangeInterface = await response.json();
      commit('setForeignExchange', foreignExchange);
    },
  },
  getters: {
    availableCurrencies({ foreignExchange }):Array<string> {
      if (!foreignExchange) return [];
      return [foreignExchange.base, ...Object.keys(foreignExchange.rates)];
    },
  },
});
