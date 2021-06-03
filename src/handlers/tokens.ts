import { Token as SDKToken, TokenPair } from "@acala-network/sdk-core"
import { SystemConsts } from "../types"
import { Token } from "../types"
import { getChainName } from "./system"
import { getTokenName } from "./utils/token"

/**
 * token config from the chain config
 * 
 * pub enum TokenSymbol {
		// Polkadot Ecosystem
		ACA("Acala", 12) = 0,
		AUSD("Acala Dollar", 12) = 1,
		DOT("Polkadot", 10) = 2,
		LDOT("Liquid DOT", 10) = 3,
		RENBTC("Ren Protocol BTC", 8) = 4,

		// Kusama Ecosystem
		KAR("Karura", 12) = 128,
		KUSD("Karura Dollar", 12) = 129,
		KSM("Kusama", 12) = 130,
		LKSM("Liquid KSM", 12) = 131,
		// Reserve for RENBTC = 132
	}
 */

export async function getToken(symbol: string) {
    const token = await Token.get(symbol)

    if (token) return token

    const temp = new Token(symbol)

    const tokens = api.registry.chainTokens
    const decimals = api.registry.chainDecimals
    const isDexShare = symbol.includes('-')

    let decimal = 10

    if (isDexShare) {
        const [token0, token1] = symbol.split('-')
        const decimal0 = decimals[tokens.findIndex(item => item === token0)]
        const decimal1 = decimals[tokens.findIndex(item => item === token1)]

        decimal = decimal0 > decimal1 ? decimal0 : decimal1
    } {
        decimal = decimals[tokens.findIndex((item) => item === symbol)]
    }

    temp.decimal = decimal
    temp.symbol = symbol

    await temp.save()

    return temp
}

export async function initSystemTokens () {
    const tokens = api.registry.chainTokens

    await Promise.all(tokens.map((symbol) => getToken(symbol)))
}

export async function getNativeToken () {
    const chainName = await getChainName()

    const systemConsts = await SystemConsts.get(chainName)

    const token = await Token.get(systemConsts.nativeTokenId)

    return token
}

export async function getStakingToken () {
    const chainName = await getChainName()

    const systemConsts = await SystemConsts.get(chainName)

    const token = await Token.get(systemConsts.stakignTokenId)

    return token
}

export async function getLiquidToken () {
    const chainName = await getChainName()

    const systemConsts = await SystemConsts.get(chainName)

    const token = await Token.get(systemConsts.liquidTokenId)

    return token
}

export async function getStableToken () {
    const chainName = await getChainName()

    const systemConsts = await SystemConsts.get(chainName)

    const token = await Token.get(systemConsts.stableTokenId)

    return token
}

export async function createLiquidPoolTokenPair (token: string) {
    const stableToken = await getStableToken()
    const currentToken = await Token.get(token)

    if (!currentToken) return


    return new TokenPair(
        new SDKToken(stableToken.symbol, { decimal: stableToken.decimal}),
        new SDKToken(currentToken.symbol, { decimal: currentToken.decimal}),
    )
}