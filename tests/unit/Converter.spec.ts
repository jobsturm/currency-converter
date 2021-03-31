import {
  expect,
} from 'chai';
import {
  shallowMount,
  createLocalVue,
} from '@vue/test-utils';
import Converter from '@/components/Converter.vue';
import Vuex, { Store } from 'vuex';
import { mutations, stateInterface, getters } from '@/store/index';
import Vue from 'vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const availableCurrencies = ['EUR', 'CAD', 'GBP', 'USD'];
const mockCurrencyAPI = {
  rates: {
    CAD: 2,
    GBP: 4,
    USD: 8,
  },
  base: 'EUR',
  date: '2021-03-31',
};

describe('Converter.vue', () => {
  let state:stateInterface;
  let store:Store<stateInterface>;

  beforeEach(() => {
    state = {
      foreignExchange: mockCurrencyAPI,
      conversionAmount: 5,
      requestError: null,
    };

    store = new Vuex.Store({
      state,
      mutations,
      getters,
    });
  });

  it('Renders options currency types when passed', () => {
    const wrapper = shallowMount(Converter, { store, localVue });
    wrapper.findAll('option').wrappers.forEach((optionWrapper, index) => {
      expect(optionWrapper.text()).to.equal(availableCurrencies[index]);
    });
  });

  it('Renders currency from conversionAmount in Store', () => {
    const wrapper = shallowMount(Converter, { store, localVue });
    const textInput = <HTMLInputElement><unknown>wrapper.find('input[type="number"]').element;
    expect(textInput.value).to.equal('5');
  });

  it('Currency changes when another currency type is selected from select', async () => {
    const wrapper = shallowMount(Converter, { store, localVue });
    const textInput = <HTMLInputElement><unknown>wrapper.find('input[type="number"]').element;
    const select = wrapper.find('select');
    await select.setValue('USD');
    expect(textInput.value).to.not.equal('5');
  });

  it('Currency converts when another currency type is selected from select', async () => {
    const wrapper = shallowMount(Converter, { store, localVue });
    const textInput = wrapper.find('input[type="number"]');
    const textInputElement = <HTMLInputElement><unknown>textInput.element;
    await textInput.setValue(5);
    const select = wrapper.find('select');
    await select.setValue('USD');
    expect(textInputElement.value).to.equal((5 * mockCurrencyAPI.rates.USD).toString());
  });

  it('Calls setForeignExchange with the correct value when amount changes', async () => {
    const wrapper = shallowMount(Converter, { store, localVue });
    const textInput = wrapper.find('input[type="number"]');
    await textInput.setValue(10);
    expect(state.conversionAmount).to.equal(10 * 100);
  });

  it('foreignExchange change triggers a new conversion and data render', async () => {
    const wrapper = shallowMount(Converter, { store, localVue });
    store.commit('setConversionAmount', 100);
    const textInput = wrapper.find('input[type="number"]');
    const textInputElement = <HTMLInputElement><unknown>textInput.element;
    await Vue.nextTick();
    expect(textInputElement.value).to.equal((100 / 100).toString());
  });
});
