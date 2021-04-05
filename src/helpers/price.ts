import { TOKEN_DECIMAL } from './token'

const feedByOracle = ['DOT', 'XBTC', 'RENBTC', 'POLKABTC']
const readFromSwap = ['ACA']

const AUSD_DECIMAL = TOKEN_DECIMAL['AUSD']

export async function getPrice (token: string, decimal: number) {
  if (feedByOracle.includes(token)) {
    const data = await api.query.acalaOracle.values({ Token: token })

    return (data as any).unwrapOrDefault().value.toBigInt() / BigInt(10 ** decimal)
  }

  if (readFromSwap.includes(token)) {
    const tradingPair = token === 'ACA'
      ? [{ Token: token }, { Token: 'AUSD' }]
      : [{ Token: 'AUSD' }, { Token: token }]
    const position = await api.query.dex.liquidityPool(tradingPair)

    const token1Position = token === 'ACA' ? position[0] : position[1];
    const token2Position = token === 'ACA' ? position[1] : position[0];

    if (token2Position.toBigInt() === BigInt(0)) {
      return BigInt(0)
    }

    return (token1Position.toBigInt() / BigInt(10 ** decimal)) / (token2Position.toBigInt() / BigInt(10 ** AUSD_DECIMAL))
  }
}