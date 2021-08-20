import { EventHandler } from "../types"
import { DexAction } from "../../types/models/DexAction"
import { ensureAccount } from "../account"
import { mapUpdateKVData } from "../utils/updateKVData"
import {
  AccountId,
  Balance,
  CurrencyId,
} from "@acala-network/types/interfaces"
import { getToken } from "../tokens"
import { FixedPointNumber } from "@acala-network/sdk-core"
import { getPrice } from "../prices"
import { getPool } from "./pool"

export const createSwapHistory: EventHandler = async ({ event, rawEvent }) => {
  const record = new DexAction(event.id)

  record.type = "swap"
  record.extrinsicId = event.extrinsicId
  record.timestamp = rawEvent.block.timestamp

  if (rawEvent.values) {
    const [who, tradingPath, supplyAmount, targetAmount] = rawEvent.event
      .data as unknown as [AccountId, CurrencyId[], Balance, Balance]

    const supplyToken = tradingPath[0]
    const targetToken = tradingPath[tradingPath.length - 1]

    const _supplyToken = await getToken(supplyToken)
    const _targetToken = await getToken(targetToken)
    const pool = await getPool(_supplyToken.name, _targetToken.name)
    const accountRecord = await ensureAccount(who.toString())

    const supplyPrice = await getPrice(_supplyToken.name)
    const targetPrice = await getPrice(_targetToken.name)

    const supplyVolume = FixedPointNumber.fromInner(
      supplyAmount.toString(),
      _supplyToken.decimal
    ).times(supplyPrice)
    const targetVolume = FixedPointNumber.fromInner(
      targetAmount.toString(),
      _supplyToken.decimal
    ).times(targetPrice)

    record.accountId = accountRecord.id
    record.poolId = pool.id
    record.token0Id = _supplyToken.id
    record.token1Id = _targetToken.id
    record.token0Amount = supplyAmount.toString()
    record.token1Amount = targetAmount.toString()

    // swap volume should divide 2
    const volumeUSD = supplyVolume
      .add(targetVolume)
      .times(new FixedPointNumber(0.5))
    
    volumeUSD.setPrecision(18)

    record.volumeUSD = volumeUSD.toChainData()
  }

  if (event.data) {
    const keyArray = [
      { key: "account" },
      { key: "path" },
      { key: "supplyAmount" },
      { key: "targetAmount" },
    ]
    record.data = mapUpdateKVData(event.data, keyArray)
  }

  return record
}

export const createAddLiquidityHistory: EventHandler = async ({
  event,
  rawEvent,
}) => {
  const record = new DexAction(event.id)

  record.type = "addLiquidity"
  record.extrinsicId = event.extrinsicId
  record.timestamp = rawEvent.block.timestamp

  if (rawEvent.values) {
    const [account, currency0, pool0Amount, currency1, pool1Amount] = rawEvent
      .event.data as unknown as [
      AccountId,
      CurrencyId,
      Balance,
      CurrencyId,
      Balance
    ]

    const token0 = await getToken(currency0)
    const token1 = await getToken(currency1)
    const token0Price = await getPrice(token0.name)
    const token1Price = await getPrice(token1.name)
    const accountRecord = await ensureAccount(account.toString())
    const pool = await getPool(token0.name, token1.name)

    const amount0 = FixedPointNumber.fromInner(
      pool0Amount.toString(),
      token0.decimal
    )
    const amount1 = FixedPointNumber.fromInner(
      pool1Amount.toString(),
      token0.decimal
    )
    const volumeUSD = amount0
      .mul(token0Price)
      .add(amount1.times(token1Price))

    volumeUSD.setPrecision(18)

    record.poolId = pool.id
    record.token0Id = token0.id
    record.token1Id = token1.id
    record.token0Amount = amount0.toChainData()
    record.token1Amount = amount1.toChainData()
    record.volumeUSD = volumeUSD.toChainData()
    record.accountId = accountRecord.id
  }

  if (event.data) {
    const keyArray = [
      { key: "account" },
      { key: "currency1" },
      { key: "amount1" },
      { key: "currency2" },
      { key: "amount2" },
      { key: "share" },
    ]
    record.data = mapUpdateKVData(event.data, keyArray)
  }

  return record
}

export const createRemoveLiquidityHistory: EventHandler = async ({
  event,
  rawEvent,
}) => {
  const record = new DexAction(event.id)

  record.type = "removeLiquidity"
  record.extrinsicId = event.extrinsicId
  record.timestamp = rawEvent.block.timestamp

  if (rawEvent.values) {
    const [account, currency0, pool0Amount, currency1, pool1Amount] = rawEvent
      .event.data as unknown as [
      AccountId,
      CurrencyId,
      Balance,
      CurrencyId,
      Balance
    ]

    const token0 = await getToken(currency0)
    const token1 = await getToken(currency1)
    const token0Price = await getPrice(token0.name)
    const token1Price = await getPrice(token1.name)
    const accountRecord = await ensureAccount(account.toString())

    const pool = await getPool(token0.name, token1.name)

    const amount0 = FixedPointNumber.fromInner(pool0Amount.toString(), token0.decimal)
    const amount1 = FixedPointNumber.fromInner(pool1Amount.toString(), token0.decimal)
    const volumeUSD = amount0.times(token0Price).add(amount1.times(token1Price))

    volumeUSD.setPrecision(18)

    record.poolId = pool.id
    record.token0Id = token0.id
    record.token1Id = token1.id
    record.token0Amount = amount0.toChainData()
    record.token1Amount = amount1.toChainData()
    record.volumeUSD = volumeUSD.toChainData()
    record.accountId = accountRecord.id

    if (event.data) {
      const keyArray = [
        { key: "account" },
        { key: "currency1" },
        { key: "amount1" },
        { key: "currency2" },
        { key: "amount2" },
        { key: "share" },
      ]
      record.data = mapUpdateKVData(event.data, keyArray)
    }

  }

  return record
}

export const createAddProvisionHistory: EventHandler = async ({
  event,
  rawEvent,
}) => {
  const record = new DexAction(event.id)

  record.type = "addProvision"
  record.extrinsicId = event.extrinsicId
  record.timestamp = rawEvent.block.timestamp

  if (rawEvent.values) {
    const [account] = rawEvent.event.data

    const accountRecord = await ensureAccount(account.toString())

    record.accountId = accountRecord.id
  }

  if (event.data) {
    const keyArray = [
      { key: "account" },
      { key: "currency1" },
      { key: "amount1" },
      { key: "currency2" },
      { key: "amount2" },
    ]
    record.data = mapUpdateKVData(event.data, keyArray)
  }

  await record.save()
}
