import { Token } from '@acala-network/sdk-core'
import { CurrencyId } from '@acala-network/types/interfaces'
import { Codec } from '@polkadot/types/types'

export function getTokenName (token: Codec) {
    if (!Reflect.has(token, 'isToken')) return 'unknown'

    const _token = token as CurrencyId

    const sdkToken = Token.fromCurrencyId(_token)

    return sdkToken.toString()
}