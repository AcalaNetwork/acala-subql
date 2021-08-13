import { Token as SDKToken, getLPCurrenciesFormName, isDexShare, forceToCurrencyIdName, MaybeCurrency, TokenPair } from "@acala-network/sdk-core"
import { SystemConsts, Token } from "../types/models"
import { getChainName } from "./system"

let tokenDecimalMap: Map<string, number>;

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

    // trade dex share decimal as token0 decimal
    if (isDexShareToken) {
        const [token0] = getLPCurrenciesFormName(tokenName);
        const decimal0 = getDecimal(token0)

        decimal = decimal0
    } {
        decimal = getDecimal(tokenName)
    }

    temp.decimal = decimal
    temp.name = tokenName
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