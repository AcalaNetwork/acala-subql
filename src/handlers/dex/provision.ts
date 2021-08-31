import { ProvisionPool } from '../../types/models/ProvisionPool'
import { EventHandler } from '../types'
import { add, getPoolId } from '../utils'
import { Balance, CurrencyId, TradingPair, AccountId } from '@acala-network/types/interfaces'
import { MaybeCurrency } from '@acala-network/sdk-core'
import { UserProvision } from '../../types/models'
import { getToken } from '../tokens'
import { createAddLiquidityHistory } from './dex-history'

async function getProvisionRecord (token0: MaybeCurrency, token1: MaybeCurrency) {
	const [id, token0Id, token1Id] = getPoolId(token0, token1)

	let record = await ProvisionPool.get(id)

	if (!record) {
		record = new ProvisionPool(id)

		record.poolTokenId = id
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

	const [id, token0Id, token1Id] = getPoolId(tradingPair[0], tradingPair[1])

	// ensure token record is exists
	await getToken(id)
	await getToken(token0Id)
	await getToken(token1Id)

	const record = await getProvisionRecord(token0Id, token1Id)

	record.startAtBlockId = event.blockId
	record.startAtBlockNumber= event.blockNumber

	await record.save()
}

export const updateProvisionByEnable: EventHandler = async ({ rawEvent, event }) => {
	// [trading_pair, pool_0_amount, pool_1_amount, total_share_amount]
	const [tradingPair, pool0Amount, pool1Amount, totalShareAmount] = rawEvent.event.data as unknown as [TradingPair, Balance, Balance, Balance]

	const [id, token0Id, token1Id] = getPoolId(tradingPair[0], tradingPair[1])

	// ensure token record is exists
	await getToken(token0Id)
	await getToken(token1Id)
	await getToken(id)

	const record = await getProvisionRecord(token0Id, token1Id)

	// reflash token0/token1/initializeShare amount
	record.token0Amount = pool0Amount.toString()
	record.token1Amount = pool1Amount.toString()
	record.initializeShare = totalShareAmount.toString()

	record.endAtBlockId = event.blockId
	record.endAtBlockNumber= event.blockNumber

	await record.save()
}

export const updateUserProvision: EventHandler = async ({ rawEvent, event }) => {
	// [who, currency_id_0, contribution_0, currency_id_1, contribution_1]
	const [account, token0, token0Amount, token1, token1Amount] = rawEvent.event.data as unknown as [AccountId, CurrencyId, Balance, CurrencyId, Balance]

	// the pool id also is the lp token name
	const [id, token0Name, token1Name] = getPoolId(token0, token1)

	const token0Record = await getToken(token0Name)
	const token1Record = await getToken(token1Name)
	const token0Decimal = token0Record.decimal
	const token1Decimal = token1Record.decimal

	await getToken(id)

	const pool = await getProvisionRecord(token0Name, token1Name)
	const record = await getUserProvisionRecord(account.toString(), token0, token1)

	// update locked in dex token amount
	token0Record.lockedInDex = add(token0Record.lockedInDex, token0Amount.toString(), token0Decimal, token0Decimal).toChainData()
	token1Record.lockedInDex = add(token1Record.lockedInDex, token1Amount.toString(), token1Decimal, token1Decimal).toChainData()

	record.token0Amount = add(record.token0Amount, token0Amount.toString(), token0Decimal, token0Decimal).toChainData()
	record.token1Amount = add(record.token1Amount, token1Amount.toString(), token1Decimal, token1Decimal).toChainData()

	pool.token0Amount = add(pool.token0Amount, token0Amount.toString(), token0Decimal, token0Decimal).toChainData()
	pool.token1Amount = add(pool.token0Amount, token0Amount.toString(), token1Decimal, token1Decimal).toChainData()

	await createAddLiquidityHistory({ rawEvent, event })
	await token0Record.save()
	await token1Record.save()
	await record.save()
	await pool.save()
}