import { EventHandler } from "./types"
import { LoanPosition } from "../types/models/LoanPosition"
import { TotalLoanPosition } from "../types/models/TotalLoanPosition"
import { forceToCurrencyIdName } from "@acala-network/sdk-core"
import { CurrencyId, Position } from "@acala-network/types/interfaces"

async function getLoanPositionRecord (account: string, token: string) {
	const key = `${account}-${token}`

	const record = await LoanPosition.get(key)

	if (!record) {
		const record = new LoanPosition(key)

		record.accountId = account
		record.tokenId = token

		await record.save()

		return record
	}

	return record
}

export const updateLoanPosition: EventHandler = async ({ rawEvent}) => {
	const [account, collateral] = rawEvent.event.data
	const record = await getLoanPositionRecord(account.toString(), forceToCurrencyIdName(collateral as CurrencyId))
	const currentPosition: Position = await api.query.loans.positions(collateral, account) as Position

	record.collateral = currentPosition.collateral.toString()
	record.debit = currentPosition.debit.toString()

	await record.save()
}

async function getTotalLoanPositionRecord (token: string) {
	const record = await TotalLoanPosition.get(token)

	if (!record) {
		const record = new TotalLoanPosition(token)

		record.tokenId = token

		await record.save()

		return record
	}

	return record
}

export const updateTotalLoanPosition: EventHandler = async ({ rawEvent }) => {
	const [_, collateral] = rawEvent.event.data

	const record = await getTotalLoanPositionRecord(forceToCurrencyIdName(collateral as CurrencyId))

	const currentPosition: Position = await api.query.loans.totalPositions(collateral ) as Position

	record.collateral = currentPosition.collateral.toString()
	record.debit = currentPosition.debit.toString()

	await record.save()
}