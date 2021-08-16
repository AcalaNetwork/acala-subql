import {
  Token as TokenSDK,
  createLPCurrencyName,
  FixedPointNumber
} from "@acala-network/sdk-core"
import {
  AccountId,
  Balance,
  CurrencyId,
  TradingPair,
} from "@acala-network/types/interfaces"
import dayjs from "dayjs"
import { Pool } from "../../types/models"
import { getPrice } from "../prices"
import { getToken } from "../tokens"
import { EventHandler } from "../types"
import { add, getPoolId, minus } from "../utils"
import { updatePoolDayData, updatePoolHourData } from "./pool-interval"

export async function getPool(a: string, b: string) {
  // sort token names
  const [token0, token1] = TokenSDK.sort(new TokenSDK(a), new TokenSDK(b)).map(
    (item) => item.name
  )
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

export const createDexPool: EventHandler = async ({ rawEvent, event }) => {
  // [trading_pair, pool_0_amount, pool_1_amount, total_share_amount\]
  const [tradingPair, token0Amount, token1Amount] = rawEvent.event
    .data as unknown as [TradingPair, Balance, Balance, Balance]

  const [, token0Name, token1Name] = getPoolId(tradingPair[0], tradingPair[1])

  const token0Record = await getToken(token0Name)
  const token1Record = await getToken(token1Name)
  const timestamp = dayjs(event.timestamp).unix()

  const pool = await getPool(token0Name, token1Name)

  // reflash all related tokens price
  const token0Price = await getPrice(token0Record.name)
  const token1Price = await getPrice(token1Record.name)
	const exchangeFee = api.consts.dex.getExchangeFee

  const _token0Amount = FixedPointNumber.fromInner(
    token0Amount.toString(),
    token0Record.decimal
  )
  const _token1Amount = FixedPointNumber.fromInner(
    token1Amount.toString(),
    token1Record.decimal
  )

  const token0TVL = _token0Amount.times(token0Price)
  const token1TVL = _token1Amount.times(token1Price)
  const totalTVL = token0TVL.add(token1TVL)

  token0Record.price = token0Price.toChainData()
  token1Record.price = token1Price.toChainData()

  pool.token0Amount = _token0Amount.toChainData()
  pool.token1Amount = _token0Amount.toChainData()
  pool.exchange0 = _token0Amount.div(_token1Amount).toChainData()
  pool.exchange1 = _token1Amount.div(_token0Amount).toChainData()

  // the swap volumn is 0 at the pool created
  pool.token0Volumn = "0"
  pool.token1Volumn = "0"
  pool.volumnUSD = "0"
  pool.txCount = 0

	pool.fee = FixedPointNumber.fromInner(exchangeFee[0].toString()).div(FixedPointNumber.fromInner(exchangeFee[1].toString())).toChainData()

  pool.token0TVL = token0TVL.toChainData()
  pool.token1TVL = token1TVL.toChainData()
  pool.tvlUSD = totalTVL.toChainData()

  const hourRecord = await updatePoolHourData(token0Name, token1Name, timestamp)
  const dayRecord = await updatePoolDayData(token0Name, token1Name, timestamp)

	await hourRecord.save()
	await dayRecord.save()
  await token0Record.save()
  await token1Record.save()
  await pool.save()
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

  const token0Amount = add(pool.token0Amount, pool0Increment.toString())
  const token1Amount = add(pool.token1Amount, pool1Increment.toString())

  // should update token amount first
  pool.token0Amount = token0Amount.toChainData()
  pool.token1Amount = token0Amount.toChainData()

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

  pool.txCount = pool.txCount + 1

  const hourRecord = await updatePoolHourData(token0Name, token1Name, timestamp)
  const dayRecord = await updatePoolDayData(token0Name, token1Name, timestamp)

  await token0Record.save()
  await token1Record.save()
	await hourRecord.save()
	await dayRecord.save()
  await pool.save()
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

  const token0Amount = minus(pool.token0Amount, pool0Decrement.toString())
  const token1Amount = minus(pool.token1Amount, pool0Decrement.toString())

  // should update token amount first
  pool.token0Amount = token0Amount.toChainData()
  pool.token1Amount = token0Amount.toChainData()

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
  token0Record.lockedInDex = minus(
    token0Record.lockedInDex,
    pool0Decrement.toString()
  ).toChainData()
  token1Record.lockedInDex = minus(
    token1Record.lockedInDex,
    pool1Decrement.toString()
  ).toChainData()

  pool.token0TVL = token0TVL.toChainData()
  pool.token1TVL = token1TVL.toChainData()
  pool.tvlUSD = totalTVL.toChainData()

  pool.txCount = pool.txCount + 1

  const hourRecord = await updatePoolHourData(token0Name, token1Name, timestamp)
  const dayRecord = await updatePoolDayData(token0Name, token1Name, timestamp)

	await hourRecord.save()
	await dayRecord.save()
  await token0Record.save()
  await token1Record.save()
  await pool.save()
}

export const updatePoolBySwap: EventHandler = async ({ rawEvent, event }) => {
  // [trader, trading_path, supply_currency_amount, target_currency_amount\]
  const [who, tradingPath, supplyAmount, targetAmount] = rawEvent.event
    .data as unknown as [AccountId, CurrencyId[], Balance, Balance]

	let lastSupplyAmount = FixedPointNumber.ZERO

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

		let token0Balance = '0'
		let token1Balance = '0'

		if (tradingPath.length === 2) {
			token0Balance = pool.token0Id === supplyToken.name ? supplyAmount.toString() : '-' + targetAmount.toString()
			token1Balance = pool.token1Id === targetToken.name ? supplyAmount.toString() : '-' + targetAmount.toString()
		} else {
			// calculate
			const supplyPool = pool.token0Id === supplyToken.name ? pool.token0Amount : pool.token1Amount
			const targetPool = pool.token0Id === supplyToken.name ? pool.token1Amount : pool.token1Amount

			const _supplyAmount = i === 0 ? FixedPointNumber.fromInner(supplyAmount.toString()) : lastSupplyAmount

			const targetAmount = FixedPointNumber.fromInner(supplyPool)
				.times(FixedPointNumber.fromInner(targetPool))
				.div(FixedPointNumber.ONE.minus(FixedPointNumber.fromInner(pool.fee)).times(_supplyAmount))

			token0Balance = pool.token0Id === supplyToken.name ? supplyAmount.toString() : '-' + targetAmount.toString()
		}

    // reflash all related tokens price
    const token0Price = await getPrice(token0Record.name)
    const token1Price = await getPrice(token1Record.name)

    const token0Amount = add(pool.token0Amount, token0Balance)
    const token1Amount = add(pool.token1Amount, token1Balance)

		const token0Changed = FixedPointNumber.fromInner(token0Balance).abs()
		const token1Changed = FixedPointNumber.fromInner(token1Balance).abs()

    // update token0Amount, token1Amount decimals for calculate
    token0Amount.forceSetPrecision(token0Record.decimal)
    token1Amount.forceSetPrecision(token1Record.decimal)
    token0Changed.forceSetPrecision(token0Record.decimal)
    token1Changed.forceSetPrecision(token1Record.decimal)

    const token0TVL = token0Amount.times(token0Price)
    const token1TVL = token1Amount.times(token1Price)
    const totalTVL = token0TVL.add(token1TVL)
		const token0Volumn = token0Changed.times(token0Price)
		const token1Volumn = token1Changed.times(token1Price)
		const totalVolumn = token0Volumn.add(token1Volumn).times(new FixedPointNumber(0.5))

    token0Record.price = token0Price.toChainData()
    token1Record.price = token1Price.toChainData()
    token0Record.lockedInDex = add(token0Record.lockedInDex, token0Balance).toChainData()
    token1Record.lockedInDex = add(token1Record.lockedInDex, token0Balance).toChainData()

    pool.token0TVL = token0TVL.toChainData()
    pool.token1TVL = token1TVL.toChainData()
    pool.tvlUSD = totalTVL.toChainData()
		pool.token0Volumn = add(pool.token0Volumn, token0Volumn.toChainData()).toChainData()
		pool.token1Volumn = add(pool.token1Volumn, token1Volumn.toChainData()).toChainData()
		pool.volumnUSD = add(pool.volumnUSD, totalVolumn.toChainData()).toChainData()

    const hourRecord = await updatePoolHourData(token0Name, token1Name, timestamp)
    const dayRecord = await updatePoolDayData(token0Name, token1Name, timestamp)

		hourRecord.volumnUSD = add(hourRecord.volumnUSD, totalVolumn.toChainData()).toChainData()
		dayRecord.volumnUSD = add(dayRecord.volumnUSD, totalVolumn.toChainData()).toChainData()

		await hourRecord.save()
		await dayRecord.save()
    await token0Record.save()
    await token1Record.save()
    await pool.save()
  }
}
