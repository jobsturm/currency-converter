export default interface ForeignExchangeInterface {
  base: string,
  date: string,
  rates: Record<string, number>,
}
