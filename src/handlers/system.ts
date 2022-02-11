// tracker all the system config like liquid token, staking token
import { get } from 'lodash'

import { CurrencyId } from "@acala-network/types/interfaces"
import{ getToken } from './tokens'
import { SystemConsts } from '../types/models'

export async function initSystemConsts () {
    const consts = await SystemConsts.get("SYSTEM")

    if (consts) return Promise.resolve(consts)

    const liquidToken =  (api.consts.homaLite?.liquidCurrencyId || api.consts.homa?.liquidCurrencyId) as unknown as CurrencyId;
    const stakingToken =  (api.consts.homaLite?.stakingCurrencyId || api.consts.homa?.stakingCurrencyId) as unknown as CurrencyId;

    const liquidTokenId = liquidToken?.asToken.toString()
    const stakingTokenId = stakingToken?.asToken.toString()
    const nativeTokenId = (api.consts.transactionPayment.nativeCurrencyId as unknown as CurrencyId).asToken.toString()
    const stableTokenId = (api.consts.cdpEngine.getStableCurrencyId as unknown as CurrencyId).asToken.toString()

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
