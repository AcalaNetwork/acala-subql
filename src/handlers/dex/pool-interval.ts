import { MaybeCurrency } from "@acala-network/sdk-core"
import { PoolDayData, PoolHourData } from "../../types/models"
import { getToken } from "../tokens"
import { getPoolId } from "../utils"
import { getPool } from "./pool"

export const updatePoolHourData = async (tokenA: MaybeCurrency, tokenB: MaybeCurrency, timestamp: number) => {
	const [poolId, token0Name, token1Name] = getPoolId(tokenA, tokenB)
	const hourIndex = BigInt(timestamp) / BigInt(3600)
	const recordId = `${poolId}-${hourIndex}`

	await getToken(token0Name)
	await getToken(token1Name)
	await getToken(poolId)

	let record = await PoolHourData.get(recordId)
	const poolRecord = await getPool(token0Name, token1Name)

	if (!record) {
		record = new PoolHourData(recordId)

		record.poolId = poolId
		record.startAt = Number(hourIndex) * 3600
		record.token0Id = token0Name
		record.token1Id = token1Name

		record.volumnToken0 = '0'
		record.volumnToken1 = '0'
		record.volumnUSD = '0'
		record.token0Open = poolRecord.exchange0
		record.token0Low = poolRecord.exchange0
		record.token0High = poolRecord.exchange0
		record.token0Close = poolRecord.exchange0
	}

	// update hour data
	record.token0Amount = poolRecord.token0Amount
	record.token1Amount = poolRecord.token1Amount
	record.exchange0 = poolRecord.exchange0
	record.exchange1 = poolRecord.exchange1
	record.tvlUSD = poolRecord.tvlUSD

	record.txCount = record.txCount + 1

	return record
}

export const updatePoolDayData = async (tokenA: MaybeCurrency, tokenB: MaybeCurrency, timestamp: number) => {
	const [poolId, token0Name, token1Name] = getPoolId(tokenA, tokenB)
	const hourIndex = BigInt(timestamp) / BigInt(3600 * 24)
	const recordId = `${poolId}-${hourIndex}`

	await getToken(token0Name)
	await getToken(token1Name)
	await getToken(poolId)

	let record = await PoolDayData.get(recordId)
	const poolRecord = await getPool(token0Name, token1Name)

	if (!record) {
		record = new PoolDayData(recordId)

		record.poolId = poolId
		record.startAt = Number(hourIndex) * 3600
		record.token0Id = token0Name
		record.token1Id = token1Name

		record.volumnToken0 = '0'
		record.volumnToken1 = '0'
		record.volumnUSD = '0'
		record.token0Open = poolRecord.exchange0
		record.token0Low = poolRecord.exchange0
		record.token0High = poolRecord.exchange0
		record.token0Close = poolRecord.exchange0
	}

	// update hour data
	record.token0Amount = poolRecord.token0Amount
	record.token1Amount = poolRecord.token1Amount
	record.exchange0 = poolRecord.exchange0
	record.exchange1 = poolRecord.exchange1
	record.tvlUSD = poolRecord.tvlUSD
	record.txCount = record.txCount + 1

	return record
}