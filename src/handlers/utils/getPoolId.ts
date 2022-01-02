import { MaybeCurrency, Token, forceToCurrencyName, createDexShareName } from '@acala-network/sdk-core'

export function getPoolId (tokenA: MaybeCurrency, tokenB: MaybeCurrency): [string, string, string] {
	const [token0, token1] = Token.sortTokenNames(forceToCurrencyName(tokenA), forceToCurrencyName(tokenB))

	return [createDexShareName(token0, token1), token0, token1];
}