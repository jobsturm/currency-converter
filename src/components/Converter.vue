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
      v-model="inputAmount"
      @input="inputAmountInputHandler"
      @focus="acceptChanges = false"
      @blur="acceptChanges = true"
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

@Component
export default class Converter extends Vue {
  @Prop({ default: false }) public readonly baseConverter!: boolean
  @State public readonly conversionAmount!:number;
  @State public readonly foreignExchange!:ForeignExchangeInterface;
  @Getter public readonly availableCurrencies:Array<string>|undefined;
  @Mutation public readonly setConversionAmount!: CallableFunction;

  inputAmount: string;
  currencyType: string;
  acceptChanges: boolean;

  constructor() {
    super();
    this.inputAmount = '5.00';
    this.currencyType = 'EUR';
    this.acceptChanges = true;
  }

  @Watch('conversionAmount')
  private convertFromEuros():void {
    if (
      !this.foreignExchange
      || !this.acceptChanges
      || this.conversionAmount === 0
    ) return;
    // if currency is not in rates, currency is the same as the base currency used in the API call
    const base = this.foreignExchange.rates[this.currencyType] || 1;
    this.inputAmount = ((this.conversionAmount * base) / 100).toFixed(2);
  }

  // The base input should not change its value when its currency type gets changed.
  private currencyTypeChangeHandler():void {
    if (this.baseConverter) {
      this.inputAmountInputHandler();
    } else {
      this.convertFromEuros();
    }
  }

  private convertToEuros(amount:number):number {
    if (!this.foreignExchange) return 0;
    // if currency is not in rates, currency is the same as the base currency used in the API call
    const base = this.foreignExchange.rates[this.currencyType] || 1;
    return (amount * 100) / base;
  }

  private sanitizeInputAmount():string {
    // Replace comma with dot
    let amount = this.inputAmount.replace(/,/g, '.');
    // Enforce a max of two decimals
    const decimalPointLength = amount.split('.')[1]?.length || 0;
    if (decimalPointLength > 2) {
      const decimalPoints = amount.split('.')[1].substring(0, 2);
      amount = `${amount.split('.')[0]}.${decimalPoints}`;
    }

    return amount;
  }

  private inputAmountInputHandler():void {
    const amount = this.sanitizeInputAmount();
    this.inputAmount = amount;
    const amountInEuros = this.convertToEuros(parseFloat(amount));
    this.setConversionAmount(amountInEuros);
  }

  private mounted():void {
    if (this.conversionAmount !== 0) this.convertFromEuros();
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
    // safari overwrites
    border-radius: 0;
    -webkit-appearance: none;
  }
  .converter--standard-converter {
    background: $grey_bg;
    .input {
      background-color: rgba($white, 1);
      color: $black;
      border-color: rgba($black, 0.1);
      &:focus {
        border-color: rgba($black, 0.3);
      }
    }
  }
  .converter--base-converter {
    .input {
      background-color: rgba($white, 0.3);
      color: $white;
      border-color: rgba($white, 0.5);
      &:focus {
        border-color: rgba($white, 1);
      }
    }
  }
</style>
