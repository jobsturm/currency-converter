import {
  expect,
} from 'chai';
import {
  shallowMount,
  createLocalVue,
} from '@vue/test-utils';
import Converter from '@/components/Converter.vue';
import Vuex, { Store } from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

const availableCurrencies = ['EUR', 'CAD', 'GBP', 'USD'];

describe('Getters.vue', () => {
  let getters;
  let store:Store<string>;

  beforeEach(() => {
    getters = {
      availableCurrencies: () => availableCurrencies,
    };

    store = new Vuex.Store({
      getters,
    });
  });

  it('renders currency types when passed', () => {
    const wrapper = shallowMount(Converter, { store, localVue });
    expect(wrapper.text()).to.include(availableCurrencies.join(''));
  });
});
