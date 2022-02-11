import { forceToCurrencyId, forceToCurrencyName, isDexShareName, mockEventRecord } from '@acala-network/sdk-core';
import { AccountId, CurrencyId, Position } from '@acala-network/types/interfaces';
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
		record.balance = '0';

		await record.save()

		return record
	}

	return record
}

async function getBalance (account: string, token: CurrencyId) {
	const tokenName = forceToCurrencyName(token);
	if (tokenName === 'KAR' || tokenName === 'ACA') {
		const data = await api.query.system.account(account)

		return data.data.free.toString()
	}

	const data = await api.query.tokens.accounts(account, token) as OrmlAccountData

	return data.free.toString()
}

async function getDexIncentiveShare (account: string, token: CurrencyId) {
	const data = await api.query.rewards.shareAndWithdrawnReward({ DexIncentive: token }, account) as unknown as [Share, Balance];

	return data[0].toString()
}

async function getLaonDeposit(account: string, token: CurrencyId) {
	const position: Position = await api.query.loans.positions(token, account) as unknown as Position

	return position.collateral.toString()
}

async function getBalanceChangedRecord (account: string, token: string, blockNumber: bigint) {
	const key = `${account}-${token}-${blockNumber}`
	const record = await BalanceChangedRecord.get(key)

	if (!record) {
		const record = new BalanceChangedRecord(key)

		record.accountId = account
		record.tokenId = token
		record.blockNumber = blockNumber;

		await record.save()

		return record
	}

	return record
}

async function getTotalBalanceChangedRecord (token: string, blockNumber: bigint) {
	const key = `${token}-${blockNumber}`
	const record = await TotalBalanceChangedRecord.get(key)

	if (!record) {
		const record = new TotalBalanceChangedRecord(key)

		record.tokenId = token
		record.blockNumber = blockNumber

		await record.save()

		return record
	}

	return record
}

async function createBalanceChangedRcord (account: string, token: CurrencyId, blockNumber: bigint) {
	const record = await getBalanceChangedRecord(account, forceToCurrencyName(token), blockNumber)

	const balance = await getBalance(account, token)

	record.balance = balance;

	if (isDexShareName(forceToCurrencyName(token))) {
		const incentive = await getDexIncentiveShare(account, token)

		record.incentive = incentive
	}

	const collateral = await getLaonDeposit(account, token)

	record.collateral = collateral

	record.total = Number(record.balance || 0) + Number(record.incentive || 0) + Number(record.collateral || 0) + ''

	await record.save()
}

async function createTotalBalanceChangedRecord(token: CurrencyId, blockNumber: bigint) {
	const record = await getTotalBalanceChangedRecord(forceToCurrencyName(token), blockNumber)

	record.balance = (await api.query.tokens.totalIssuance(token)).toString()

	record.save()
}

async function updateBalanceRecord (account: string, token: CurrencyId) {
	const record = await getUserBalanceRecord(account, forceToCurrencyName(token))

	const balance = await getBalance(account, token)

	record.balance = balance

	if (isDexShareName(forceToCurrencyName(token))) {
		const incentive = await getDexIncentiveShare(account, token);

		record.incentive = incentive;
	}

	const collateral = await getLaonDeposit(account, token)

	record.collateral = collateral

	record.total = Number(record.balance || 0) + Number(record.incentive || 0) + Number(record.collateral || 0) + ''

	await record.save() as unknown as [CurrencyId, AccountId, AccountId];
}

export const updateBalanceByTransferred: EventHandler = async ({ event, rawEvent }) => {
	const [currency, from, to] = rawEvent.event.data as unknown as [CurrencyId, AccountId, AccountId];

	const blockNumber = event.blockNumber

	await getToken(currency)
	await ensureAccount(from.toString())
	await ensureAccount(to.toString())

	const fromAccount = from.toString()
	const toAccount = to.toString()

	await updateBalanceRecord(fromAccount, currency)
	await updateBalanceRecord(toAccount, currency)
	await createBalanceChangedRcord(fromAccount, currency, blockNumber)
	await createBalanceChangedRcord(toAccount, currency, blockNumber)
}

export const updateBalanceByDeposit: EventHandler = async ({ event, rawEvent }) => {
	const [currency, who] = rawEvent.event.data as unknown as [CurrencyId, AccountId];

	const blockNumber = event.blockNumber

	await ensureAccount(who.toString())
	await getToken(currency)

	const whoAccount = who.toString()

	await updateBalanceRecord(whoAccount, currency)
	await createBalanceChangedRcord(whoAccount, currency, blockNumber)
	await createTotalBalanceChangedRecord(currency, blockNumber)
}

export const updateBalanceByWithdrawn: EventHandler = async ({ event, rawEvent }) => {
	const [currency, who] = rawEvent.event.data as unknown as [CurrencyId, AccountId];

	const blockNumber = event.blockNumber

	await getToken(currency)
	await ensureAccount(who.toString())

	const whoAccount = who.toString()

	await updateBalanceRecord(whoAccount, currency)
	await createBalanceChangedRcord(whoAccount, currency, blockNumber)
	await createTotalBalanceChangedRecord(currency, blockNumber)
}

export const updateBalanceByUpdate: EventHandler = async ({ event, rawEvent }) => {
	const [currency, who] = rawEvent.event.data as unknown as [CurrencyId, AccountId];

	const blockNumber = event.blockNumber

	await getToken(currency)
	await ensureAccount(who.toString())

	const whoAccount = who.toString()

	await updateBalanceRecord(whoAccount, currency)
	await createBalanceChangedRcord(whoAccount, currency, blockNumber)
	await createTotalBalanceChangedRecord(currency, blockNumber)
}