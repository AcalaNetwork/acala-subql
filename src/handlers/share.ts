import { createLPCurrencyName, eventSectionsFilter, forceToCurrencyId, forceToCurrencyIdName } from "@acala-network/sdk-core"
import { CurrencyId, TradingPair } from "@acala-network/types/interfaces"
import { Balance, Provision, ProvisionOpenState, ProvisionRecord, Share, ShareRecord, TotalShareRecord } from "../types/models"
import { ensureAccount } from "./account"
import { getToken } from "./tokens"
import { EventHandler } from "./types"
import { getTokenName } from "./utils/token"

async function getShare (account: string, token: string) {
	const key = `${account}-${token}`

	const record = await Share.get(key)

	if (!record) {
		const record = new Share(key)

		record.accountId = account
		record.tokenId = token

		await record.save()

		return record
	}

	return record
}

async function getShareRecord (account: string, token: string, blockId: string, blockNumber: bigint) {
	const key = `${account}-${token}-${blockNumber}`

	const record = await ShareRecord.get(key)

	if (!record) {
		const record = new ShareRecord(key)

		record.accountId = account
		record.tokenId = token
		record.blockNumber = blockNumber
		record.blockId = blockId

		await record.save()

		return record
	}

	return record
}

async function getProvision (account: string, token0:string, token1: string, lpToken: string) {
	const key = `${account}-${lpToken}`

	const record = await Provision.get(key)

	if (!record) {
		const record = new Provision(key)

		record.accountId = account
		record.token0Id = token0
		record.token1Id = token1
		record.lpTokenId = lpToken

		await record.save()

		return record
	}

	return record
}

async function getProvisionRecord (account: string, token0 :string, token1: string, lpToken: string, blockId: string, blockNumber: bigint) {
	const key = `${account}-${lpToken}-${blockNumber}`

	const record = await ProvisionRecord.get(key)

	if (!record) {
		const record = new ProvisionRecord(key)

		record.accountId = account
		record.token0Id = token0
		record.token1Id = token1
		record.lpTokenId = lpToken
		record.blockId = blockId
		record.blockNumber = blockNumber

		await record.save()

		return record
	}

	return record
}

export const updateProvision: EventHandler = async ({ event, rawEvent }) => {
	// [who, currency_id_0, contribution_0, /// currency_id_1, contribution_1\]
	const [who, token0, balance0, token1, balance1] = rawEvent.event.data;

	const account = who.toString()
	const token0Name = forceToCurrencyIdName(token0 as CurrencyId)
	const token1Name = forceToCurrencyIdName(token1 as CurrencyId)
	const lpTokenName = createLPCurrencyName(token0Name, token1Name);

	await ensureAccount(account)
	await getToken(token0Name)
	await getToken(token1Name)
	await getToken(lpTokenName)

	const record = await getProvision(account, token0Name, token1Name, lpTokenName);

	record.token0Amount = Number(record.token0Amount || 0) + Number(balance0.toString()) + ''
	record.token1Amount = Number(record.token1Amount || 0) + Number(balance1.toString()) + ''

	const blockId = event.blockId
	const blockNumber = event.blockNumber

	const changedRecord = await getProvisionRecord(
		account,
		token0Name,
		token1Name,
		lpTokenName,
		blockId,
		blockNumber
	)

	changedRecord.token0Amount = record.token0Amount;
	changedRecord.token1Amount = record.token1Amount;

	await changedRecord.save()
	await record.save()
}

export const udpateShareByAdd: EventHandler = async ({ event, rawEvent }) => {
	//\[who, currency_id_0, pool_0_increment, currency_id_1, pool_1_increment, share_increment\]
	const [who, token0, token0Amount, token1, token1Amount, incrementShare] = rawEvent.event.data;

	const account = who.toString()
	const token0Name = forceToCurrencyIdName(token0 as CurrencyId)
	const token1Name = forceToCurrencyIdName(token1 as CurrencyId)
	const lpTokenName = createLPCurrencyName(token0Name, token1Name);
	const share = incrementShare.toString()

	await ensureAccount(account)
	await getToken(token0Name)
	await getToken(token1Name)
	await getToken(lpTokenName)
	
	const record = await getShare(account, lpTokenName)

	record.amount = Number(record.amount || 0) + Number(share || 0) + ''

	const blockId = event.blockId
	const blockNumber = event.blockNumber

	const chagnedRecord = await getShareRecord(account, lpTokenName, blockId, blockNumber)

	chagnedRecord.amount = record.amount

	await saveTotalShareRecord(lpTokenName, blockId, blockNumber)
	await record.save()
	await chagnedRecord.save()
}

export const udpateShareByRemove: EventHandler = async ({ event, rawEvent }) => {
	// [who, currency_id_0, pool_0_decrement, currency_id_1, pool_1_decrement, share_decrement\]
	const [who, token0, token0Amount, token1, token1Amount, decrementShare ] = rawEvent.event.data;

	const account = who.toString()
	const token0Name = forceToCurrencyIdName(token0 as CurrencyId)
	const token1Name = forceToCurrencyIdName(token1 as CurrencyId)
	const lpTokenName = createLPCurrencyName(token0Name, token1Name);
	const share = decrementShare.toString()

	await ensureAccount(account)
	await getToken(token0Name)
	await getToken(token1Name)
	await getToken(lpTokenName)
	
	const record = await getShare(account, lpTokenName)

	record.amount = Number(record.amount || 0) - Number(share || 0) + ''

	const blockId = event.blockId
	const blockNumber = event.blockNumber

	const chagnedRecord = await getShareRecord(account, lpTokenName, blockId, blockNumber)

	chagnedRecord.amount = record.amount

	await saveTotalShareRecord(lpTokenName, blockId, blockNumber)
	await record.save()
	await chagnedRecord.save()
}


async function getProvisionOpenState (lpToken:string, blockNumber: bigint) {
	const key = `$${lpToken}-${blockNumber}`

	const record = await ProvisionOpenState.get(key)

	if (!record) {
		const record = new ProvisionOpenState(key)

		record.tokenId = lpToken
		record.blockNumber = blockNumber

		await record.save()

		return record
	}

	return record
}

export const updateProvisionOpenState: EventHandler = async ({ event, rawEvent }) => {
	// [trading_pair, pool_0_amount, pool_1_amount, total_share_amount\]
	const [ pair, token0Amount, token1Amount, initialShare ] = rawEvent.event.data

	const token0 = (pair as TradingPair)[0]
	const token1 = (pair as TradingPair)[1]

	const lpToken = createLPCurrencyName(
		forceToCurrencyIdName(token0),
		forceToCurrencyIdName(token1)
	);

	const blockNumber = event.blockNumber
	const blockId = event.blockId

	const record = await getProvisionOpenState(lpToken, blockNumber)

	record.token0 = token0Amount.toString()
	record.token1 = token1Amount.toString()
	record.initIssuance = initialShare.toString()

	await saveTotalShareRecord(lpToken, blockId, blockNumber)
	await record.save()
}

async function getTotalShareRecord (lpToken: string, blockId: string, blockNumber: bigint) {
	const key = `${lpToken}-${blockNumber}`

	const record = await TotalShareRecord.get(key)

	if (!record) {
		const record = new TotalShareRecord(key)

		record.tokenId = lpToken
		record.blockNumber = blockNumber
		record.blockId = blockId

		await record.save()

		return record
	}

	return record
}

async function saveTotalShareRecord (lpToken: string, blockId: string, blockNumber: bigint) {
	const record = await getTotalShareRecord(lpToken, blockId, blockNumber);

	const amount = await api.query.tokens.totalIssuance(forceToCurrencyId(api, lpToken)) as unknown as Balance

	record.amount = amount.toString()

	await record.save()
}