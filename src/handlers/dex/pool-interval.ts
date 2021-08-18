import { MaybeCurrency } from "@acala-network/sdk-core"
import dayjs from "dayjs"
import { DexDayData, PoolDayData, PoolHourData } from "../../types/models"
import { getToken } from "../tokens"
import { getPoolId } from "../utils"
import { getDex } from "./dex"
import { getPool } from "./pool"

export const updatePoolHourData = async (tokenA: MaybeCurrency, tokenB: MaybeCurrency, timestamp: number) => {
	const [poolId, token0Name, token1Name] = getPoolId(tokenA, tokenB)
	const hourIndex = Math.ceil(timestamp / 3600)
	const recordId = `${poolId}-${hourIndex}`

	await getToken(token0Name)
	await getToken(token1Name)
	await getToken(poolId)

	let record = await PoolHourData.get(recordId)
	const poolRecord = await getPool(token0Name, token1Name)

	if (!record) {
		record = new PoolHourData(recordId)

		record.poolId = poolId
		record.date = dayjs.unix(hourIndex * 3600).toDate()
		record.token0Id = token0Name
		record.token1Id = token1Name

		record.volumeToken0 = '0'
		record.volumeToken1 = '0'
		record.volumeUSD = '0'
		record.token0Open = poolRecord.exchange0
		record.token0Low = poolRecord.exchange0
		record.token0High = poolRecord.exchange0
		record.token0Close = poolRecord.exchange0
		record.txCount = 0

		await record.save()
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
	const dayIndex = Math.ceil(timestamp / 3600 / 24)
	const recordId = `${poolId}-${dayIndex}`

	await getToken(token0Name)
	await getToken(token1Name)
	await getToken(poolId)

	let record = await PoolDayData.get(recordId)
	const poolRecord = await getPool(token0Name, token1Name)

	if (!record) {
		record = new PoolDayData(recordId)

		record.poolId = poolId
		record.date = dayjs.unix(dayIndex * 3600 * 24).toDate()
		record.token0Id = token0Name
		record.token1Id = token1Name

		record.volumeToken0 = '0'
		record.volumeToken1 = '0'
		record.volumeUSD = '0'
		record.token0Open = poolRecord.exchange0
		record.token0Low = poolRecord.exchange0
		record.token0High = poolRecord.exchange0
		record.token0Close = poolRecord.exchange0
		record.txCount = 0

		await record.save()
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

export const updateDexDayData= async (timestamp: number) => {
	const dex = await getDex()
	const dayIndex = Math.ceil(timestamp / 3600 / 24)
	const recordId = `${dex.id}-${dayIndex}`

	let record = await DexDayData.get(recordId)

	if (!record) {
		record = new DexDayData(recordId)

		record.date = dayjs.unix(dayIndex * 3600 * 24).toDate()
		record.dailyVolumeUSD = '0'

		await record.save()
	}

	record.poolCount = dex.poolCount
	record.totalVolumeUSD = dex.totalVolumeUSD
	record.totalTVLUSD = dex.totalTVLUSD

	return record
}