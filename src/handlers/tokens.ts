import { Token as SDKToken, getLPCurrenciesFormName, isDexShare, forceToCurrencyIdName, MaybeCurrency, TokenPair } from "@acala-network/sdk-core"
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
let tokenDecimalMap: Map<string, number>;
let systemTokens: Map<string, string>;

function getDecimal (token: string) {
    return tokenDecimalMap.get(token) || 10;
}

// get token info include 
export async function getToken(currency: MaybeCurrency) {
    const tokenName = forceToCurrencyIdName(currency);

    const token = await Token.get(tokenName)

    if (token) return token

    // create token if the token doesn't exits
    const temp = new Token(tokenName)

    // build the token decimal map
    if (!tokenDecimalMap) {
        const tokens = api.registry.chainTokens
        const decimals = api.registry.chainDecimals

        tokenDecimalMap = new Map<string, number>(
            tokens.map((item, index) => [item, decimals[index]])
        )
    }

    let decimal = 10

    // TODO: handle erc20
    const isDexShareToken = isDexShare(tokenName);

    if (isDexShareToken) {
        const [token0, token1] = getLPCurrenciesFormName(tokenName);
        const decimal0 = getDecimal(token0)
        const decimal1 = getDecimal(token1)

        decimal = decimal0 > decimal1 ? decimal0 : decimal1
    } {
        decimal = getDecimal(tokenName)
    }

    temp.decimal = decimal
    temp.symbol = tokenName
    temp.isDexShare = isDexShareToken

    await temp.save()

    return temp
}

export async function initSystemTokens () {
    const tokens = api.registry.chainTokens

    // ensure that all basic tokens are created
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