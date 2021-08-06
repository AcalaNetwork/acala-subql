import { forceToCurrencyId, forceToCurrencyIdName, isDexShare, mockEventRecord } from '@acala-network/sdk-core';
import { CurrencyId, Position } from '@acala-network/types/interfaces';
import { Share } from '@open-web3/orml-types/interfaces/rewards';
import { OrmlAccountData } from '@open-web3/orml-types/interfaces/tokens';
import { Balance, BalanceChangedRecord, TotalBalanceChangedRecord } from "../types/models";
import { ensureAccount } from './account';
import { getToken } from './tokens';
import { EventHandler } from './types';

async function getUserBalanceRecord (account: string, token: string) {
	const key = `${account}-${token}`

	const record = await Balance.get(key)

	if (!record) {
		const record = new Balance(key)

		record.accountId = account
		record.tokenId = token
		record.balance = '0'

		await record.save()

		return record
	}

	return record
}

async function getBalance (account: string, token: string) {
	if (token === 'KAR' || token === 'ACA') {
		const data = await api.query.system.account(account)

		return data.data.free.toString()
	}

	const data = await api.query.tokens.accounts(account, forceToCurrencyId(api, token)) as OrmlAccountData

	return data.free.toString()
}

async function getDexIncentiveShare (account: string, token: string) {
	const data = await api.query.rewards.shareAndWithdrawnReward({ DexIncentive: forceToCurrencyId(api, token) }, account) as unknown as [Share, Balance];

	return data[0].toString()
}

async function getLaonDeposit(account: string, token: string) {
	const position: Position = await api.query.loans.positions(forceToCurrencyId(api, token), account) as Position

	return position.collateral.toString()
}

async function getBalanceChangedRecord (account: string, token: string, blockNumber: BigInt) {
	const key = `${account}-${token}-${blockNumber}`
	const record = await BalanceChangedRecord.get(key)

	if (!record) {
		const record = new BalanceChangedRecord(key)

		record.accountId = account
		record.tokenId = token
		record.blockNumber = BigInt(blockNumber)

		await record.save()

		return record
	}

	return record
}

async function getTotalBalanceChangedRecord (token: string, blockNumber: BigInt) {
	const key = `${token}-${blockNumber}`
	const record = await TotalBalanceChangedRecord.get(key)

	if (!record) {
		const record = new TotalBalanceChangedRecord(key)

		record.tokenId = token
		record.blockNumber = BigInt(blockNumber)

		await record.save()

		return record
	}

	return record
}

async function createBalanceChangedRcord (account: string, token: string, blockNumber: BigInt, block: string) {
	const record = await getBalanceChangedRecord(account, token, blockNumber)

	const balance = await getBalance(account, token)

	record.blockId = block
	record.balance = balance

	if (isDexShare(token)) {
		const incentive = await getDexIncentiveShare(account, token)

		record.incentive = incentive
	}

	const collateral = await getLaonDeposit(account, token)

	record.collateral = collateral

	record.total = Number(record.balance || 0) + Number(record.incentive || 0) + Number(record.collateral || 0) + ''

	await record.save()
}

async function createTotalBalanceChangedRecord(token: string, blockNumber: BigInt, block: string) {
	const record = await getTotalBalanceChangedRecord(token, blockNumber)

	record.blockId = block
	record.balance = (await api.query.tokens.totalIssuance(forceToCurrencyId(api, token))).toString()

	record.save()
}

async function updateBalanceRecord (account: string, token: string) {
	const record = await getUserBalanceRecord(account, token)

	const balance = await getBalance(account, token)

	record.balance = balance

	if (isDexShare(token)) {
		const incentive = await getDexIncentiveShare(account, token);

		record.incentive = incentive;
	}

	const collateral = await getLaonDeposit(account, token)

	record.collateral = collateral

	record.total = Number(record.balance || 0) + Number(record.incentive || 0) + Number(record.collateral || 0) + ''

	await record.save()
}

export const updateBalanceByTransferred: EventHandler = async ({ event, rawEvent }) => {
	const [currency, from, to] = rawEvent.event.data

	const block = event.blockId
	const blockNumber = event.blockNumber

	await getToken(currency as CurrencyId)
	await ensureAccount(from.toString())
	await ensureAccount(to.toString())

	const fromAccount = from.toString()
	const toAccount = to.toString()
	const currencyName = forceToCurrencyIdName(currency as CurrencyId)

	await updateBalanceRecord(fromAccount, currencyName)
	await updateBalanceRecord(toAccount, currencyName)
	await createBalanceChangedRcord(fromAccount, currencyName, blockNumber, block )
	await createBalanceChangedRcord(toAccount, currencyName, blockNumber, block )
}

export const updateBalanceByDeposit: EventHandler = async ({ event, rawEvent }) => {
	const [currency, who] = rawEvent.event.data

	const block = event.blockId
	const blockNumber = event.blockNumber

	await ensureAccount(who.toString())
	await getToken(currency as CurrencyId)

	const whoAccount = who.toString()
	const currencyName = forceToCurrencyIdName(currency as CurrencyId)

	await updateBalanceRecord(whoAccount, currencyName)
	await createBalanceChangedRcord(whoAccount, currencyName, blockNumber, block )
	await createTotalBalanceChangedRecord(currencyName, blockNumber, block)
}

export const updateBalanceByWithdrawn: EventHandler = async ({ event, rawEvent }) => {
	const [currency, who] = rawEvent.event.data

	const block = event.blockId
	const blockNumber = event.blockNumber

	await getToken(currency as CurrencyId)
	await ensureAccount(who.toString())

	const whoAccount = who.toString()
	const currencyName = forceToCurrencyIdName(currency as CurrencyId)

	await updateBalanceRecord(whoAccount, currencyName)
	await createBalanceChangedRcord(whoAccount, currencyName, blockNumber, block )
	await createTotalBalanceChangedRecord(currencyName, blockNumber, block)
}

export const updateBalanceByUpdate: EventHandler = async ({ event, rawEvent }) => {
	const [currency, who] = rawEvent.event.data

	const block = event.blockId
	const blockNumber = event.blockNumber

	await getToken(currency as CurrencyId)
	await ensureAccount(who.toString())

	const whoAccount = who.toString()
	const currencyName = forceToCurrencyIdName(currency as CurrencyId)

	await updateBalanceRecord(whoAccount, currencyName)
	await createBalanceChangedRcord(whoAccount, currencyName, blockNumber, block )
	await createTotalBalanceChangedRecord(currencyName, blockNumber, block)
}