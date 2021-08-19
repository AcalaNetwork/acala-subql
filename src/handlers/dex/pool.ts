import {
  Token as TokenSDK,
  createLPCurrencyName,
  FixedPointNumber,
  forceToCurrencyId
} from "@acala-network/sdk-core"
import {
  AccountId,
  Balance,
  CurrencyId,
  Position,
  TradingPair,
} from "@acala-network/types/interfaces"
import dayjs from "dayjs"
import { Pool } from "../../types/models"
import { getPrice } from "../prices"
import { getToken } from "../tokens"
import { EventHandler } from "../types"
import { add, getPoolId, minus } from "../utils"
import { getDex } from "./dex"
import { createAddLiquidityHistory, createRemoveLiquidityHistory, createSwapHistory } from "./dexHistory"
import { updateDexDayData, updatePoolDayData, updatePoolHourData, updateTokenDayData } from "./pool-interval"

export async function getPool(a: string, b: string) {
  const [token0, token1] = TokenSDK.sortTokenNames(a, b)
  const poolName = createLPCurrencyName(token0, token1)

  let record = await Pool.get(poolName)

  if (!record) {
    record = new Pool(poolName)

    // query the old data
    const position = await api.query.dex.liquidityPool([forceToCurrencyId(api as any, token0), forceToCurrencyId(api as any, token1)]) as unknown as Position;

    record.token0Id = token0
    record.token1Id = token1
    record.token0Amount = position?.[0].toString() || '0'
    record.token1Amount = position?.[1].toString() || '0'
    record.txCount = BigInt(0)
    record.fee = '3000000000000000'

    await record.save()
  }

  return record
}

export const createDexPool: EventHandler = async ({ rawEvent, event }) => {
  // [trading_pair, pool_0_amount, pool_1_amount, total_share_amount\]
  const [tradingPair, token0Amount, token1Amount] = rawEvent.event
    .data as unknown as [TradingPair, Balance, Balance, Balance]

  const [, token0Name, token1Name] = getPoolId(tradingPair[0], tradingPair[1])

  const token0Record = await getToken(token0Name)
  const token1Record = await getToken(token1Name)
  const timestamp = dayjs(event.timestamp).unix()

  const pool = await getPool(token0Name, token1Name)
  const dex = await getDex()

  const _token0Amount = FixedPointNumber.fromInner(token0Amount.toString(), token0Record.decimal)
  const _token1Amount = FixedPointNumber.fromInner(token1Amount.toString(), token1Record.decimal)

  pool.token0Amount = _token0Amount.toChainData()
  pool.token1Amount = _token1Amount.toChainData()
  pool.exchange0 = _token1Amount.div(_token0Amount).toChainData()
  pool.exchange1 = _token0Amount.div(_token1Amount).toChainData()

  // reflash all related tokens price
  const token0Price = await getPrice(token0Record.name)
  const token1Price = await getPrice(token1Record.name)
	const exchangeFee = api.consts.dex.getExchangeFee

  const token0TVL = _token0Amount.times(token0Price)
  const token1TVL = _token1Amount.times(token1Price)
  const totalTVL = token0TVL.add(token1TVL)

  token0Record.price = token0Price.toChainData()
  token1Record.price = token1Price.toChainData()

  // the swap volume is 0 at the pool created
  pool.token0Volume = "0"
  pool.token1Volume = "0"
  pool.volumeUSD = "0"

	pool.fee = FixedPointNumber.fromInner(exchangeFee[0].toString()).div(FixedPointNumber.fromInner(exchangeFee[1].toString())).toChainData()

  pool.token0TVL = token0TVL.toChainData()
  pool.token1TVL = token1TVL.toChainData()
  pool.tvlUSD = totalTVL.toChainData()

  dex.totalTVLUSD = add(dex.totalTVLUSD, pool.tvlUSD).toChainData()
  dex.poolCount = dex.poolCount + 1

  const hourRecord = await updatePoolHourData(token0Name, token1Name, timestamp)
  const dayRecord = await updatePoolDayData(token0Name, token1Name, timestamp)
  const dexDayRecord = await updateDexDayData(timestamp)

  await dexDayRecord.save()
	await hourRecord.save()
	await dayRecord.save()
  await token0Record.save()
  await token1Record.save()
  await pool.save()
  await dex.save()
}

export const updatePoolByAddLiquidity: EventHandler = async ({
  rawEvent,
  event,
}) => {
  // [who, currency_id_0, pool_0_increment, currency_id_1, pool_1_increment, share_increment\]
  const [, currency0, pool0Increment, currency1, pool1Increment] = rawEvent
    .event.data as unknown as [
    AccountId,
    CurrencyId,
    Balance,
    CurrencyId,
    Balance
  ]

  const [, token0Name, token1Name] = getPoolId(currency0, currency1)

  const token0Record = await getToken(token0Name)
  const token1Record = await getToken(token1Name)
  const timestamp = dayjs(event.timestamp).unix()

  const pool = await getPool(token0Name, token1Name)
  const dex = await getDex()

  const token0Amount = add(pool.token0Amount, pool0Increment.toString())
  const token1Amount = add(pool.token1Amount, pool1Increment.toString())

  // should update token amount first
  pool.token0Amount = token0Amount.toChainData()
  pool.token1Amount = token1Amount.toChainData()

  // update token0Amount, token1Amount decimals for calculate
  token0Amount.forceSetPrecision(token0Record.decimal)
  token1Amount.forceSetPrecision(token1Record.decimal)

  // reflash all related tokens price
  const token0Price = await getPrice(token0Record.name)
  const token1Price = await getPrice(token1Record.name)

  const token0TVL = token0Amount.times(token0Price)
  const token1TVL = token1Amount.times(token1Price)
  const totalTVL = token0TVL.add(token1TVL)

  token0Record.price = token0Price.toChainData()
  token1Record.price = token1Price.toChainData()
  token0Record.lockedInDex = add(token0Record.lockedInDex, pool0Increment.toString()).toChainData()
  token1Record.lockedInDex = add(token1Record.lockedInDex, pool1Increment.toString()).toChainData()

  pool.token0TVL = token0TVL.toChainData()
  pool.token1TVL = token1TVL.toChainData()
  pool.tvlUSD = totalTVL.toChainData()
  pool.txCount = pool.txCount + BigInt(1)

  dex.totalTVLUSD = add(dex.totalTVLUSD, pool.tvlUSD).toChainData()

  const hourRecord = await updatePoolHourData(token0Name, token1Name, timestamp)
  const dayRecord = await updatePoolDayData(token0Name, token1Name, timestamp)
  const dexDayRecord = await updateDexDayData(timestamp)
  const history = await createAddLiquidityHistory({ event, rawEvent })

  await history.save()
  await dexDayRecord.save()
  await token0Record.save()
  await token1Record.save()
	await hourRecord.save()
	await dayRecord.save()
  await pool.save()
  await dex.save()
}

export const updatePoolByRemoveLiquidity: EventHandler = async ({
  rawEvent,
  event,
}) => {
  // [who, currency_id_0, pool_0_decrement, currency_id_1, pool_1_decrement, share_decrement\]
  const [, currency0, pool0Decrement, currency1, pool1Decrement] = rawEvent
    .event.data as unknown as [
    AccountId,
    CurrencyId,
    Balance,
    CurrencyId,
    Balance
  ]

  const [, token0Name, token1Name] = getPoolId(currency0, currency1)

  const token0Record = await getToken(token0Name)
  const token1Record = await getToken(token1Name)
  const timestamp = dayjs(event.timestamp).unix()

  const pool = await getPool(token0Name, token1Name)
  const dex = await getDex()

  const token0Amount = minus(pool.token0Amount, pool0Decrement.toString())
  const token1Amount = minus(pool.token1Amount, pool1Decrement.toString())

  // should update token amount first
  pool.token0Amount = token0Amount.toChainData()
  pool.token1Amount = token1Amount.toChainData()

  // update token0Amount, token1Amount decimals for calculate
  token0Amount.forceSetPrecision(token0Record.decimal)
  token1Amount.forceSetPrecision(token1Record.decimal)

  // reflash all related tokens price
  const token0Price = await getPrice(token0Record.name)
  const token1Price = await getPrice(token1Record.name)

  const token0TVL = token0Amount.times(token0Price)
  const token1TVL = token1Amount.times(token1Price)
  const totalTVL = token0TVL.add(token1TVL)

  token0Record.price = token0Price.toChainData()
  token1Record.price = token1Price.toChainData()

  token0Record.lockedInDex = minus(token0Record.lockedInDex, pool0Decrement.toString()).toChainData()
  token1Record.lockedInDex = minus(token1Record.lockedInDex, pool1Decrement.toString()).toChainData()

  const prevTVL = pool.tvlUSD

  pool.token0TVL = token0TVL.toChainData()
  pool.token1TVL = token1TVL.toChainData()
  pool.tvlUSD = totalTVL.toChainData()
  pool.txCount = pool.txCount + BigInt(1)

  dex.totalTVLUSD = add(
    minus(dex.totalTVLUSD, prevTVL).toChainData(),
    pool.tvlUSD
  ).toChainData()

  const hourRecord = await updatePoolHourData(token0Name, token1Name, timestamp)
  const dayRecord = await updatePoolDayData(token0Name, token1Name, timestamp)
  const dexDayRecord = await updateDexDayData(timestamp)
  const history = await createRemoveLiquidityHistory({ rawEvent, event })

  await history.save()
  await dexDayRecord.save()
	await hourRecord.save()
	await dayRecord.save()
  await token0Record.save()
  await token1Record.save()
  await pool.save()
  await dex.save()
}

export const updatePoolBySwap: EventHandler = async ({ rawEvent, event }) => {
  // [trader, trading_path, supply_currency_amount, target_currency_amount\]
  const [who, tradingPath, supplyAmount, targetAmount] = rawEvent.event
    .data as unknown as [AccountId, CurrencyId[], Balance, Balance]

	let nextSupplyAmount = FixedPointNumber.ZERO

  for (let i = 0; i < tradingPath.length - 1; i++) {
    const currency0 = tradingPath[i]
    const currency1 = tradingPath[i + 1]

		const supplyToken = await getToken(currency0)
		const targetToken = await getToken(currency0)

    const [, token0Name, token1Name] = getPoolId(currency0, currency1)
    const token0Record = await getToken(token0Name)
    const token1Record = await getToken(token1Name)
    const timestamp = dayjs(event.timestamp).unix()

    const pool = await getPool(token0Name, token1Name)
    const dex = await getDex()

		let token0Balance = '0'
		let token1Balance = '0'

		if (tradingPath.length === 2) {
			token0Balance = pool.token0Id === supplyToken.name ? supplyAmount.toString() : '-' + targetAmount.toString()
			token1Balance = pool.token1Id === supplyToken.name ? supplyAmount.toString() : '-' + targetAmount.toString()
		} else {
			// calculate
			const supplyPool = pool.token0Id === supplyToken.name ? pool.token0Amount : pool.token1Amount
			const targetPool = pool.token0Id === supplyToken.name ? pool.token1Amount : pool.token1Amount

      const _supplyPool = FixedPointNumber.fromInner(supplyPool)
      const _targetPool = FixedPointNumber.fromInner(targetPool)

			const _supplyAmount = i === 0 ? FixedPointNumber.fromInner(supplyAmount.toString()) : nextSupplyAmount

			const targetAmount = _targetPool.minus(
        _supplyPool.times(_targetPool)
          .div(_supplyPool.add((_supplyAmount.times(FixedPointNumber.ONE.minus(FixedPointNumber.fromInner(pool.fee))))))
      ) 

      // update next supply amount
      nextSupplyAmount = targetAmount

			token0Balance = pool.token0Id === supplyToken.name ? _supplyAmount.toChainData() : '-' + targetAmount.toChainData()
			token1Balance = pool.token1Id === supplyToken.name ? _supplyAmount.toChainData() : '-' + targetAmount.toChainData()
		}

    // get price before change amount
    const token0Price = await getPrice(token0Record.name)
    const token1Price = await getPrice(token1Record.name)

    const token0Amount = add(pool.token0Amount, token0Balance)
    const token1Amount = add(pool.token1Amount, token1Balance)

		const token0Changed = FixedPointNumber.fromInner(token0Balance).abs()
		const token1Changed = FixedPointNumber.fromInner(token1Balance).abs()

    // set exchange first
    pool.exchange0 = token1Amount.div(token0Amount).toChainData()
    pool.exchange1 = token0Amount.div(token1Amount).toChainData()

    // update token0Amount, token1Amount decimals for calculate
    token0Amount.forceSetPrecision(token0Record.decimal)
    token1Amount.forceSetPrecision(token1Record.decimal)
    token0Changed.forceSetPrecision(token0Record.decimal)
    token1Changed.forceSetPrecision(token1Record.decimal)

    const prevTVL = pool.tvlUSD

    const token0TVL = token0Amount.times(token0Price)
    const token1TVL = token1Amount.times(token1Price)
    const totalTVL = token0TVL.add(token1TVL)
		const token0VolumeUSD = token0Changed.times(token0Price)
		const token1VolumeUSD = token1Changed.times(token1Price)
		const totalVolumeUSD = token0VolumeUSD.add(token1VolumeUSD).times(new FixedPointNumber(0.5))

    // update token data
    token0Record.price = token0Price.toChainData()
    token1Record.price = token1Price.toChainData()
    token0Record.lockedInDex = add(token0Record.lockedInDex, token0Balance).toChainData()
    token1Record.lockedInDex = add(token1Record.lockedInDex, token1Balance).toChainData()
    token0Record.volume = add(token0Record.volume, token0Changed).toChainData()
    token1Record.volume = add(token0Record.volume, token1Changed).toChainData()
    token0Record.volumeUSD = add(token0Record.volumeUSD, token0VolumeUSD).toChainData()
    token1Record.volumeUSD = add(token1Record.volumeUSD, token1VolumeUSD).toChainData()
    token0Record.txCount = token0Record.txCount + BigInt(1)
    token1Record.txCount = token0Record.txCount + BigInt(1)

    pool.token0Amount = token0Amount.toChainData()
    pool.token1Amount = token1Amount.toChainData()
    pool.token0TVL = token0TVL.toChainData()
    pool.token1TVL = token1TVL.toChainData()
    pool.tvlUSD = totalTVL.toChainData()
		pool.token0Volume = add(pool.token0Volume, token0Changed).toChainData()
		pool.token1Volume = add(pool.token1Volume, token1Changed).toChainData()
		pool.volumeUSD = add(pool.volumeUSD, totalVolumeUSD).toChainData()

    dex.totalTVLUSD = add(minus(dex.totalTVLUSD, prevTVL), pool.tvlUSD).toChainData()

    await token0Record.save()
    await token1Record.save()
    await pool.save()
    await dex.save()

    // update daily and hour data
    const hourRecord = await updatePoolHourData(token0Name, token1Name, timestamp)
    const dayRecord = await updatePoolDayData(token0Name, token1Name, timestamp)
    const dexDayRecord = await updateDexDayData(timestamp)
    const token0DayRecord = await updateTokenDayData(token0Name, timestamp)
    const token1DayRecord = await updateTokenDayData(token1Name, timestamp)

		hourRecord.volumeUSD = add(hourRecord.volumeUSD, totalVolumeUSD).toChainData()
		dayRecord.volumeUSD = add(dayRecord.volumeUSD, totalVolumeUSD).toChainData()
		dexDayRecord.dailyVolumeUSD = add(dayRecord.volumeUSD, totalVolumeUSD).toChainData()

    token0DayRecord.dailyVolumeToken = add(token0DayRecord.dailyVolumeToken, token0Changed).toChainData()
    token0DayRecord.dailyVolumeUSD = add(token0DayRecord.dailyVolumeUSD, token0VolumeUSD).toChainData()
    token0DayRecord.dailyTxCount = token0DayRecord.dailyTxCount + BigInt(1)

    token1DayRecord.dailyVolumeToken = add(token1DayRecord.dailyVolumeToken, token1Changed).toChainData()
    token1DayRecord.dailyVolumeUSD = add(token1DayRecord.dailyVolumeUSD, token1VolumeUSD).toChainData()
    token1DayRecord.dailyTxCount = token1DayRecord.dailyTxCount + BigInt(1)

    await token0DayRecord.save()
    await token1DayRecord.save()
		await hourRecord.save()
		await dayRecord.save()
    await dexDayRecord.save()
  }

  const history = await createSwapHistory({ event, rawEvent })

  await history.save()
}
