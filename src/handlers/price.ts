import { FixedPointNumber } from "@acala-network/sdk-core"
import { Balance } from "@acala-network/types/interfaces"

import { TimestampedValue } from '@open-web3/orml-types/interfaces'
import { Option } from '@polkadot/types'

import { Price } from "../types"
import { createLiquidPoolTokenPair, getNativeToken, getStableToken, getStakingToken, getToken } from "./tokens"

export async function getPriceFromChain (symbol: string) {
    const token = await getToken(symbol)

    if (symbol=== 'AUSD' || symbol === 'KUSD') return new FixedPointNumber(1, token.decimal)

    // try to get price in oracle
    try {
        const feededPrice = await api.query.acalaOracle.values<Option<TimestampedValue>>({ Token: symbol })

        if (!feededPrice.isEmpty) {
            const value = feededPrice.unwrapOrDefault().value.toString()

            return FixedPointNumber.fromInner(value)
        } 
    } catch(e) {
        // swallow error
    }

    // try to get price in dex
    const tokenPair = await createLiquidPoolTokenPair(symbol)

    if (!tokenPair) return

    const [token0, token1] = tokenPair.getPair()

    const pool = await api.query.dex.liquidityPool<[Balance, Balance]>(tokenPair.toChainData())

    const token0Balance  = pool[0].toString()
    const token1Balance = pool[1].toString()

    if (symbol === token0.name) {
        return FixedPointNumber.fromInner(token0Balance, token0.decimal)
            .div(FixedPointNumber.fromInner(token1Balance, token1.decimal))
    } else {
        return FixedPointNumber.fromInner(token0Balance, token0.decimal)
            .div(FixedPointNumber.fromInner(token1Balance, token1.decimal))
    }
}

// export async function getPriceFromOracle (token: string) {
//     const value = await (api.query as any).acalaOracle.getValue('Acala', token)

//     logger.info(value)
// }

export async function getPrice (token: string) {
    const record = await Price.get(token)

    return record
}

export async function createPrice (token: string, price: string) {
    let record = await Price.get(token)

    if (!record) {
        record = await new Price(token)
    }

    record.price = price
    record.token = token

    await record.save()

    return record
}

export async function savePricesFromChain (token: string) {
    const price = await getPriceFromChain(token)

    await createPrice(token, price.toString())
}

export async function initPrices () {
    const tokens = api.registry.chainTokens

    await Promise.all(tokens.map((item) => savePricesFromChain(item)))
}