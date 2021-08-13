import { EventHandler } from "../types"
import { LoanPosition } from "../../types/models/LoanPosition"
import { TotalLoanPosition } from "../../types/models/TotalLoanPosition"
import { MaybeAccount, MaybeCurrency, forceToCurrencyIdName } from "@acala-network/sdk-core"
import { Amount, CurrencyId, AccountId, OptionRate } from "@acala-network/types/interfaces"
import { add } from "../utils"
import { LoanParams } from "../../types/models"
import { LoanParamsHistory } from "../../types/models/LoanParamsHistory"
import { getToken } from "../tokens"

async function getLoanPositionRecord (owner: MaybeAccount, token: MaybeCurrency ) {
	const collateralName = forceToCurrencyIdName(token)
	const ownerAddress = owner.toString()
	const key = `${ownerAddress}-${collateralName}`

	let record = await LoanPosition.get(key)

	if (!record) {
	  record = new LoanPosition(key)

		record.ownerId = ownerAddress
		record.collateralId = collateralName
		record.debitAmount = '0'
		record.collateralAmount = '0'

		await record.save()
	}

	return record
}

async function getTotalLoanPositionRecord (token: MaybeCurrency) {
	const collateralName = forceToCurrencyIdName(token)

	let record = await TotalLoanPosition.get(collateralName)

	if (!record) {
		record = new TotalLoanPosition(collateralName)

		record.collateralId = collateralName
		record.debitAmount = '0'
		record.collateralAmount = '0'

		await record.save()
	}

	return record
}

async function getLoanParamsRecord (token: MaybeCurrency) {
	const collateralName = forceToCurrencyIdName(token)

	let record = await LoanParams.get(collateralName)

	if (!record) {
		record = new LoanParams(collateralName)

		record.collateralId = collateralName
		record.maximumTotalDebitValue = '0'
		record.interestRatePerSec = '0'
		record.liquidationRatio = '0'
		record.liquidationPenalty = '0'
		record.requiredCollateralRatio = '0'
		record.globalInterestRatePerSec = '0'

		await record.save()
	}

	return record
}

async function getLoanParamsHistoryRecord (token: MaybeCurrency, blockNumber: BigInt, blockId: string) {
	const collateralName = forceToCurrencyIdName(token)
	const recordId = `${collateralName}-${blockNumber}`

	let record = await LoanParamsHistory.get(recordId)

	if (!record) {
		record = new LoanParamsHistory(recordId)

		// if the history record create, that means the params was end to use
		record.endAtBlockNumber = BigInt(blockNumber)
		record.endAtBlockId = blockId
		record.collateralId = collateralName
		record.maximumTotalDebitValue = '0'
		record.interestRatePerSec = '0'
		record.liquidationRatio = '0'
		record.liquidationPenalty = '0'
		record.requiredCollateralRatio = '0'
		record.globalInterestRatePerSec = '0'

		await record.save()
	}

	return record
}


// update user loan position and global loan position
export const updateLoanPosition: EventHandler = async ({ rawEvent}) => {
	// [owner, collateral_type, collateral_adjustment, debit_adjustment\]
	const [owner, collateral, collateralAdjustment, debitAdjustment] = rawEvent.event.data as unknown as [AccountId, CurrencyId, Amount, Amount];

	const collateralToken = await getToken(collateral)
	const record = await getLoanPositionRecord(owner, collateral)
	const totalRecord = await getTotalLoanPositionRecord(collateral)

	record.collateralAmount = add(record.collateralAmount, collateralAdjustment.toString()).toChainData()
	record.debitAmount = add(record.debitAmount, debitAdjustment.toString()).toChainData()

	totalRecord.collateralAmount = add(record.collateralAmount, collateralAdjustment.toString()).toChainData()
	totalRecord.debitAmount = add(record.debitAmount, debitAdjustment.toString()).toChainData()

	collateralToken.lockedInLoan = add(collateralToken.lockedInLoan, collateralAdjustment.toString()).toChainData()

	await collateralToken.save()
	await totalRecord.save()
	await record.save()
}

// update user loan position and global loan position when liquidate
export const updateLoanPositionByLiquidate: EventHandler = async ({ rawEvent}) => {
	// [collateral_type, owner, collateral_amount, bad_debt_value, liquidation_strategy\]
	const [collateral, owner, collateralAmount, badDebtValue] = rawEvent.event.data as unknown as [CurrencyId, AccountId, Amount, Amount];

	const collateralToken = await getToken(collateral)
	const record = await getLoanPositionRecord(owner, collateral);
	const totalRecord = await getTotalLoanPositionRecord(collateral)

	const positionCollateralAmount = record.collateralAmount
	const positionDebitAmount = record.debitAmount

	// force set position to zero
	record.collateralAmount = '0'
	record.debitAmount = '0'

	totalRecord.collateralAmount = add(record.collateralAmount, positionCollateralAmount).toChainData()
	totalRecord.debitAmount = add(record.debitAmount, positionDebitAmount).toChainData()

	collateralToken.lockedInLoan = '0'
	// TODO: should handle liquidate information

	await collateralToken.save()
	await totalRecord.save()
	await record.save()
}


const createParamsUpdateFN = (name: string): EventHandler => {
	return async ({ event, rawEvent }) => {
		const [collateral, data] = rawEvent.event.data as  unknown as [CurrencyId, OptionRate]
	
		const blockNumber = event.blockNumber
		const blockId = event.blockId
	
		const record = await getLoanParamsRecord(collateral)
		const historyRecord = await getLoanParamsHistoryRecord(collateral, blockNumber, blockId)
	
		const preData = record[name]
		const preStartAtBlockNumber = record.startAtBlockNumber
		const preStartAtBlockId = record.startAtBlockId
	
		record[name] = data.toString()
		record.startAtBlockNumber = blockNumber
	
		historyRecord.startAtBlockNumber = preStartAtBlockNumber
		historyRecord.startAtBlockId = preStartAtBlockId
		historyRecord[name] = preData
	
		await historyRecord.save()
		await record.save()
	};
}

export const handleInterestRatePerSecUpdated = createParamsUpdateFN('interestRatePerSec')
export const handleLiquidationRatioUpdated = createParamsUpdateFN('liquidationRatio')
export const handleLiquidationPenaltyUpdated = createParamsUpdateFN('liquidationPenalty')
export const handleRequiredCollateralRatioUpdated = createParamsUpdateFN('requiredCollateralRatio')
export const handleMaximumTotalDebitValueUpdated = createParamsUpdateFN('maximumTotalDebitValue')
export const handleGlobalInterestRatePerSecUpdated = createParamsUpdateFN('globalInterestRatePerSec')
