import { ProvisionPool } from '../../types/models/ProvisionPool'
import { EventHandler } from '../types'
import { add, getPoolId } from '../utils'
import { Balance, CurrencyId, TradingPair } from '@acala-network/types/interfaces'
import { MaybeCurrency } from '@acala-network/sdk-core'
import { UserProvision } from '../../types/models'

async function getProvisionRecord (token0: MaybeCurrency, token1: MaybeCurrency) {
	const [id, token0Id, token1Id] = getPoolId(token0, token1)

	let record = await ProvisionPool.get(id)

	if (!record) {
		record = new ProvisionPool(id)

		record.token0Id = token0Id
		record.token1Id = token1Id

		record.token0Amount = '0'
		record.token1Amount = '0'

		await record.save()
	}

	return record
}

async function getUserProvisionRecord (user: string, token0: MaybeCurrency, token1: MaybeCurrency) {
	const [id, token0Id, token1Id] = getPoolId(token0, token1)
	const recordId = `${user}-${id}`;

	let record = await UserProvision.get(recordId)

	if (!record) {
		record = new UserProvision(recordId)

		record.poolId = id
		record.token0Id = token0Id
		record.token1Id = token1Id

		record.token0Amount = '0'
		record.token1Amount = '0'

		await record.save()
	}

	return record
}

export const createProvision: EventHandler  = async ({ rawEvent, event }) => {
	// [trading_pair, pool_0_amount, pool_1_amount, total_share_amount]
	const [tradingPair] = rawEvent.event.data as unknown as [TradingPair]

	const record = await getProvisionRecord(tradingPair[0], tradingPair[1])

	record.startAtBlockId = event.blockId
	record.startAtBlockNumber= event.blockNumber

	await record.save()
}

export const updateProvisionByEnable: EventHandler = async ({ rawEvent, event }) => {
	// [trading_pair, pool_0_amount, pool_1_amount, total_share_amount]
	const [tradingPair, pool0Amount, pool1Amount, totalShareAmount] = rawEvent.event.data as unknown as [TradingPair, Balance, Balance, Balance]

	const record = await getProvisionRecord(tradingPair[0], tradingPair[1])

	// reflash token0/token1/initializeShare amount
	record.token0Amount = pool0Amount.toString()
	record.token1Amount = pool1Amount.toString()
	record.initializeShare = totalShareAmount.toString()

	record.endAtBlockId = event.blockId
	record.endAtBlockNumber= event.blockNumber

	await record.save()
}

export const updateUserProvision: EventHandler = async ({ rawEvent }) => {
	// [who, currency_id_0, contribution_0, currency_id_1, contribution_1]
	const [account, token0, token0Amount, token1, token1Amount] = rawEvent.event.data as unknown as [Account, CurrencyId, Balance, CurrencyId, Balance]

	const record = await getUserProvisionRecord(account.toString(), token0, token1)
	const pool = await getProvisionRecord(token0, token1)

	record.token0Amount = add(record.token0Amount, token0Amount.toString()).toChainData()
	record.token1Amount = add(record.token1Amount, token1Amount.toString()).toChainData()

	pool.token0Amount = add(pool.token0Amount, token0Amount.toString()).toChainData()
	pool.token1Amount = add(pool.token0Amount, token0Amount.toString()).toChainData()

	await pool.save()
	await record.save()
}