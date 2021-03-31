<template>
  <div id="app" class="currency_converter">
    <header class="currency_converter__header">
      <h1 class="headline4">Currency Converter</h1>
    </header>
    <main
      v-if="!requestError && foreignExchange"
      class="currency_converter__converters"
    >
      <Converter
        class="currency_converter__converter"
        v-for="index in converterCount"
        :key="`converter-${index}`"
        :baseConverter="index === 1"
      />
      <div class="currency_converter__controls">
        <button class="currency_converter_button" @click="addConverter">Add currency</button>
      </div>
    </main>
    <main v-else-if="!requestError">
      <p class="body1">Loading</p>
    </main>
    <main v-else>
      <p class="body1">
        Sadly our datasource is currently unreachable, try again later.
      </p>
      {{ requestError }}
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import ForeignExchangeInterface from '@/Interfaces/ForeignExchangeInterface';
import Converter from '@/components/Converter.vue';

@Component({
  components: {
    Converter,
  },
})
export default class App extends Vue {
  @State public readonly requestError!:string|null;
  @State public readonly foreignExchange!:ForeignExchangeInterface|undefined;
  @Action private getForeignExchange!:CallableFunction;

  converterCount: number;

  constructor() {
    super();
    this.converterCount = 2;
  }

  private addConverter():void {
    this.converterCount += 1;
  }

  private mounted():void {
    this.getForeignExchange();
  }
}
</script>

<style lang="scss">
  @import '@/style_variables/main.scss';

  * {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    font-size: 16px;
    @media (prefers-color-scheme: dark) {
      background: $dark;
      color: $white;
    }
  }
</style>

<style lang="scss" scoped>
  @import '@/style_variables/main.scss';

  .currency_converter {
    margin: 0 auto;
    width: 50rem;
    max-width: 100%;
    padding: 5rem 1rem;
    @media (max-width: 768px) {
      padding: 1rem;
    }
  }

  .currency_converter__converters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    column-gap: 1rem;
    row-gap: 1rem;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  .currency_converter__converter {
    grid-column-start: 2;
    @media (max-width: 768px) {
      grid-column-start: 1;
    }
    &:first-of-type {
      grid-column-start: 1;
    }
  }
  .currency_converter__controls {
    grid-column-start: 2;
    @media (max-width: 768px) {
      grid-column-start: 1;
    }
  }
  .currency_converter_button {
    @extend .body1;
    color: $white;
    padding: 1rem;
    border-radius: 0.25rem;
    border: 0;
    background-color: $primary;
    text-transform: uppercase;
    transition: all 200ms ease;
    &:hover, &:focus {
      background-color: darken($primary, 8);
      cursor: pointer;
    }
  }
</style>
