import { Token as TokenSDK, createLPCurrencyName, forceToCurrencyIdName, FixedPointNumber } from "@acala-network/sdk-core"
import { TradingPair } from "@acala-network/types/interfaces"
import { Pool, Token } from "../../types"
import { getPrice } from "../prices"
import { getToken } from "../tokens"
import { EventHandler } from "../types"

export async function getPool (a: string, b: string) {
	// sort token names
	const [token0, token1] = TokenSDK.sort(new TokenSDK(a), new TokenSDK(b)).map((item) => item.name)
	const poolName = createLPCurrencyName(token0, token1)

	const record = await Pool.get(poolName)

	if (!record) {
		const pool = new Pool(poolName)
		const token0Record = await getToken(token0)
		const token1Record = await getToken(token1)

		pool.token0Id = token0Record.id
		pool.token1Id = token1Record.id

		await pool.save()
	}

	return record
}

export const handleProvisioningToEnabled: EventHandler = async ({ rawEvent }) => {
	// [trading_pair, pool_0_amount, pool_1_amount, total_share_amount\]
	const [tradingPair, token0Amount, token1Amount, lpShare] = rawEvent.event.data

	const [token0, token1] = tradingPair as TradingPair

	const token0Name = forceToCurrencyIdName(token0)
	const token1Name = forceToCurrencyIdName(token1)
	const lpTokenName = createLPCurrencyName(token0Name, token1Name)

	const pool = await getPool(token0Name, token1Name)
	const token0Record = await getToken(token0Name)
	const token1Record = await getToken(token1Name)
	const lpTokenRecord = await getToken(lpTokenName)

	// update lp token issuance,  the lp issuance only can be modified by provisionEnable/addLiquidity/removeLiqudity
	lpTokenRecord.issuance = FixedPointNumber.fromInner(lpTokenRecord.issuance || 0)
		.add(FixedPointNumber.fromInner(lpShare.toString())).toChainData()

	// reflash all related tokens price
	const token0Price = await getPrice(token0Record.name)
	const token1Price = await getPrice(token1Record.name)
	

	const _token0Amount = FixedPointNumber.fromInner(token0Amount.toString(), token0Record.decimal)
	const _token1Amount = FixedPointNumber.fromInner(token1Amount.toString(), token1Record.decimal)

	const token0TVL = _token0Amount.times(token0Price)
	const token1TVL = _token1Amount.times(token1Price)
	const totalTVL = token0TVL.add(token1TVL)


	token0Record.price = token0Price.toChainData()
	token1Record.price = token1Price.toChainData()

	pool.

	await pool.save()
}