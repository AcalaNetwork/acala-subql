// tracker all the system config like liquid token, staking token
import { get } from 'lodash'

import { CurrencyId } from "@acala-network/types/interfaces"
import{ upsertToken } from './tokens'
import { SystemConsts } from '../types'

function getConsts<T> (path: string) {
    return get(api.consts, path) as T
}

export async function initSystemConsts () {
    const chainName = await getChainName() 

    const consts = await SystemConsts.get(chainName)

    if (consts) return Promise.resolve(consts)

    const liquidToken = getConsts<CurrencyId>('stakingPool.liquidCurrencyId')
    const stakingToken = getConsts<CurrencyId>('stakingPool.stakingCurrencyId')
    const nativeToken = getConsts<CurrencyId>('transactionPayment.nativeCurrencyId');
    const stableToken =  getConsts<CurrencyId>('transactionPayment.stableCurrencyId');

    const liquidTokenId = liquidToken.asToken.toString()
    const stakingTokenId = stakingToken.asToken.toString()
    const nativeTokenId = nativeToken.asToken.toString()
    const stableTokenId = stableToken.asToken.toString()

    await upsertToken(liquidTokenId)
    await upsertToken(stakingTokenId)
    await upsertToken(stableTokenId)
    await upsertToken(nativeTokenId)

    const temp = new SystemConsts(chainName)

    temp.liquidTokenId = liquidTokenId
    temp.stakignTokenId = stakingTokenId
    temp.nativeTokenId = nativeTokenId
    temp.stableTokenId = stableTokenId

    await temp.save()

    return temp
}

export async function getChainName () {
    return api.runtimeChain.toString()
}