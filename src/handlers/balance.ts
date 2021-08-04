import { FixedPointNumber } from '@acala-network/sdk-core';
import { Balance, TotalBalance } from "../types/models";

async function getTotalBalanceOrDefaultRecord (token: string) {
	const current = await TotalBalance.get(token)

	if (!current) {
		const record = TotalBalance.create(token)

		record.tokenId = token

		return record
	}

	return current
}

// record the fresh total balance data
export async function updateTotalBalance (token: string, changed: string) {
	const record = await getTotalBalanceOrDefaultRecord(token)

	record.balance = new FixedPointNumber(record.balance || 0).add(new FixedPointNumber(changed || 0)).toChainData()

	await record.save();
}

async function getUserBalanceOrDefaultRecord (account: string, token: string) {
	const key = `${account}-${token}`
	const current = await Balance.get(key)

	if (!current) {
		const record = Balance.create(key)

		record.accountId = account
		record.tokenId = token
		record.balance = '0'

		return record
	}

	return current
}

export async function updateUserBalance (account: string, token: string, changed: string) {
	const record = await getUserBalanceOrDefaultRecord(account, token)

	record.balance = new FixedPointNumber(record.balance || 0).add(new FixedPointNumber(changed || 0)).toChainData()

	await record.save()
}

export async function createUserBalanceChangedRecord () {

}

export async function createTotalBalanceChangedRecord () {

}