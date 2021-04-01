<template>
  <div
    class="converter"
    :class="{
      'converter--base-converter': baseConverter,
      'converter--standard-converter': !baseConverter,
    }"
  >
    <input
      class="converter__amount_input input"
      type="number"
      step="any"
      inputmode="decimal"
      v-model.number="inputAmount"
      @input="inputAmountInputHandler"
    />
    <select
      class="converter__currency_type_input input"
      v-model="currencyType"
      @change="currencyTypeChangeHandler"
    >
      <option
        class="input__option"
        v-for="currency in availableCurrencies"
        :key="currency"
      >{{ currency }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import {
  Getter,
  Mutation,
  State,
} from 'vuex-class';
import ForeignExchangeInterface from '@/Interfaces/ForeignExchangeInterface';
import convertToTwoDecimals from '@/helpers/convertToTwoDecimals';

@Component
export default class Converter extends Vue {
  @Prop({ default: false }) public readonly baseConverter!: boolean
  @State public readonly globalAmount!:number;
  @State public readonly foreignExchange!:ForeignExchangeInterface;
  @Getter public readonly availableCurrencies:Array<string>|undefined;
  @Mutation public readonly setGlobalAmount!: CallableFunction;

  inputAmount: number;
  currencyType: string;

  constructor() {
    super();
    this.inputAmount = 5.00;
    this.currencyType = 'EUR';
  }

  /* when one of the converters sets the global globalAmount
   * this function will update the inputAmount to reflect that. */
  @Watch('globalAmount')
  private convertFromEuros():void {
    if (
      !this.foreignExchange
      || this.globalAmount === 0
    ) return;
    const base = this.foreignExchange.rates[this.currencyType];
    const rawAmount = (this.globalAmount * base) / 100;
    this.inputAmount = convertToTwoDecimals(rawAmount);
  }

  // The base converter should not change its value when its currency type gets changed.
  private currencyTypeChangeHandler():void {
    if (this.baseConverter) {
      this.inputAmountInputHandler();
    } else {
      this.convertFromEuros();
    }
  }

  private convertToEuros(amount:number):number {
    if (!this.foreignExchange) return 0;
    const base = this.foreignExchange.rates[this.currencyType];
    return (amount * 100) / base;
  }

  private inputAmountInputHandler():void {
    const amount = convertToTwoDecimals(this.inputAmount);
    // When you empty a numeric field, it will return an empty string as its value.
    if (typeof this.inputAmount === 'number') this.inputAmount = amount;
    const amountInEuros = this.convertToEuros(amount);
    this.setGlobalAmount(amountInEuros);
  }

  private mounted():void {
    if (this.globalAmount !== 0) this.convertFromEuros();
  }
}
</script>

<style lang="scss" scoped>
  @import '@/style_variables/main.scss';

  .converter {
    background: $primary;
    padding: 1rem;
    border-radius: 0.5rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  .input {
    @extend .body1;
    outline: 0;
    font-size: 1.5rem;
    height: 3.5rem;
    border: 0;
    border-bottom: 0.125rem solid;
  }
  .input__option {
    color: $black;
  }
  .converter__amount_input {
    width: calc(100% - 5rem);
    padding: 0.25rem 0.75rem;
  }
  .converter__currency_type_input {
    width: 5rem;
    flex-shrink: 0;
    margin-left: 0.5rem;
    padding: 0.25rem;
    text-align: center;
    // safari overwrites
    border-radius: 0;
    -webkit-appearance: none;
  }
  .converter--standard-converter {
    background: $grey_bg_light;
    .input {
      background: rgba($white, 1);
      color: $black;
      border-color: rgba($black, 0.1);
      @media (prefers-color-scheme: dark) {
        background: rgba($white, 0.2);
        color: $white;
        border-color: rgba($white, 0.1);
      }
      &:focus {
        border-color: rgba($black, 0.3);
        @media (prefers-color-scheme: dark) {
          border-color: rgba($white, 0.3);
        }
      }
    }
    @media (prefers-color-scheme: dark) {
      background: $grey_bg_dark;
    }
  }
  .converter--base-converter {
    .input {
      background: rgba($white, 0.3);
      color: $white;
      border-color: rgba($white, 0.5);
      &:focus {
        border-color: rgba($white, 1);
      }
    }
  }
</style>
