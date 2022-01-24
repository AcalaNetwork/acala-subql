// tracker all the system config like liquid token, staking token
import { get } from 'lodash'

import { CurrencyId } from "@acala-network/types/interfaces"
import{ getToken } from './tokens'
import { SystemConsts } from '../types/models'

function getConsts<T> (path: string) {
    return get(api.consts, path) as T
}

export async function initSystemConsts () {
    const consts = await SystemConsts.get("SYSTEM")

    if (consts) return Promise.resolve(consts)

    const liquidToken =  (api.consts.homaLite?.liquidCurrencyId || api.consts.homa?.liquidCurrencyId) as CurrencyId;
    const stakingToken =  (api.consts.homaLite?.stakingCurrencyId || api.consts.homa?.stakingCurrencyId) as CurrencyId;
    const nativeToken = getConsts<CurrencyId>('transactionPayment.nativeCurrencyId');
    const stableToken =  getConsts<CurrencyId>('cdpEngine.getStableCurrencyId');

    const liquidTokenId = liquidToken?.asToken.toString()
    const stakingTokenId = stakingToken?.asToken.toString()
    const nativeTokenId = nativeToken?.asToken.toString()
    const stableTokenId = stableToken?.asToken.toString()

    await getToken(stableTokenId)
    await getToken(nativeTokenId)

    if (stakingToken && liquidToken) {
        await getToken(liquidTokenId)
        await getToken(stakingTokenId)
    }

    const temp = new SystemConsts('SYSTEM')

    temp.liquidTokenId = liquidTokenId
    temp.stakignTokenId = stakingTokenId
    temp.nativeTokenId = nativeTokenId
    temp.stableTokenId = stableTokenId

    await temp.save()

    return temp
}
