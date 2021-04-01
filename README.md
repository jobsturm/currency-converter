# Currency Converter

## About
This is a simple currency converter that supports bidirectional currency converting for multiple currencies at the same time. Data is gotten from https://ratesapi.io/, this datasource is updated [every time](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html) the European Central Bank updates their foreign exchange reference rates.

## Project setup
```
Install dependencies: npm install
Start development server: npm run serve
Run unit tests: npm run test:unit
Lints files: npm run lint
```

## Project structure
The App renders multiple Converter components, these Converters are dependent on a store for their data. Every Converter has a numeric input and a currency selector. Based on those it will convert its own value to Euros. Every time that amount changes it will update the globalAmount in the store. When this amount changes all other Converters will use that as their base amount and update their local amounts.

## Improvements and quick wins
* Add i18n
* Add A11y
* Add better currency input with support for decimal zeroes
* Add better dropdowns, preferably searchable and populated with better data.
* Get API data directly from the European Central Bank instead of going via a third party
* Add PWA support
* Cache API response

## API Challenges
The API I was using as suggested by the take home test email got changed to a pay model the night of March the 31st and April 1st, lucky for me https://ratesapi.io/ has the exact same API response and remains free, so I started using that.
