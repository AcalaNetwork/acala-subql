import { CurrencyId } from '@acala-network/types/interfaces'
import { Codec } from '@polkadot/types/types'

interface Token {
  name: string;
  isDex: boolean;
  isToken: boolean;
  isERC20: boolean;
}

export const TOKEN_DECIMAL = {
  // ACA("Acala", 13) = 0,
  // AUSD("Acala Dollar", 12) = 1,
  // DOT("Polkadot", 10) = 2,
  // LDOT("Liquid DOT", 10) = 3,
  // XBTC("ChainX BTC", 8) = 4,
  // RENBTC("Ren Protocol BTC", 8) = 5,
  // POLKABTC("PolkaBTC", 8) = 6,
  // PLM("Plasm", 18) = 7,
  // PHA("Phala", 18) = 8,
  // HDT("HydraDX", 12) = 9,
  // BCG("Bit.Country", 18) = 11,

  // // Kusama Ecosystem
  // KAR("Karura", 12) = 128,
  // KUSD("Karura Dollar", 12) = 129,
  // KSM("Kusama", 12) = 130,
  // LKSM("Liquid KSM", 12) = 131,
  // // Reserve for XBTC = 132
  // // Reserve for RENBTC = 133
  // // Reserve for POLKABTC = 134
  // SDN("Shiden", 18) = 135,
  // // Reserve for PHA = 136
  // // Reserve for HDT = 137
  // KILT("Kilt", 15) = 138,
  // // Reserve for BCG = 139
  ACA: 13,
  AUSD: 12,
  DOT: 10,
  LDOT: 10,
  XBTC: 8,
  RENBTC: 8,
  POLKABTC: 8,
  PLM: 18,
  PHA: 18,
  HDT: 12,
  BCG: 18,
  KAR: 12,
  KSM: 12,
  LKSM: 12,
  SDN: 18,
  KILT: 15
}

export function resolveToken (token: Codec) {
  if ((token as CurrencyId).isToken) {
    const name = (token as CurrencyId).asToken.toString()

    return {
      name,
      decimal: TOKEN_DECIMAL[name] || 18,
      isDex: false,
      isToken: true,
      isERC20: false,
    }
  }

  if ((token as CurrencyId).isDexShare) {
    const _token = token as CurrencyId

    const token1 = _token.asDexShare[0].toString()
    const token2 = _token.asDexShare[1].toString()
    const token1Decimal = TOKEN_DECIMAL[token1] || 18
    const token2Decimal = TOKEN_DECIMAL[token2] || 18

    const decimal = (token1Decimal > token2Decimal) ? token1Decimal : token2Decimal
    const name = `${_token.asDexShare[0].toString()}-${_token.asDexShare[1].toString()}`

    return {
      name: name,
      decimal,
      isDex: true,
      isToken: false,
      isERC20: false,
    }
  }

  if ((token as CurrencyId).isErc20) {
    return {
      name: (token as CurrencyId).asErc20.toString(),
      isDex: false,
      isToken: false,
      isERC20: true,
    }
  }

  return {
    name: 'unknown',
    isDex: false,
    isToken: false,
    isERC20: false
  }
}
