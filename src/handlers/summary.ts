import { forceToCurrencyName } from "@acala-network/sdk-core";
import { CurrencyId } from "@acala-network/types/interfaces";
// import { Summary } from "../types/models/Summary"
// import { SummaryDayData } from "../types/models/SummaryDayData"
import { EventHandler } from "./types"
// import { getDayDataId } from "./utils/getDayDataId"

// async function getSummaryRecord () {
// 	const record = await Summary.get('1')

// 	if (!record) {
// 		const record = new Summary('1')

// 		record.crossedKSMAmount = '0'
// 		record.treasury = '0'
// 		record.accounts = 0
// 		record.transitions = 0
// 		record.transfers = 0
// 		record.crossChainMessage = 0

// 		await record.save()

// 		return record
// 	}

// 	return record
// }

// async function getSummaryDayDataRecord (timestamp: number) {
// 	const id= getDayDataId(timestamp)

// 	const record = await SummaryDayData.get(id)

// 	if (!record) {
// 		const record = new SummaryDayData(id)

// 		record.crossedKSMAmount = '0'
// 		record.treasury = '0'
// 		record.accounts = 0
// 		record.transitions = 0
// 		record.transfers = 0
// 		record.crossChainMessage = 0
// 		record.date = new Date(id)

// 		await record.save()

// 		return record
// 	}

// 	return record
// }

// export const updateCrossedKSM: EventHandler = async ({ rawEvent, event }) => {
// 	const record = await getSummaryRecord();

// 	const timestamp = event.timestamp.getDate()
// 	const dayRecord = await getSummaryDayDataRecord(timestamp)

// 	const method = event.method
// 	const [currency,, amount] = rawEvent.event.data;

// 	if (forceToCurrencyName(currency as CurrencyId) !== 'KSM') return;

// 	if (method === 'Deposit') {
// 		record.crossedKSMAmount = Number(record.crossedKSMAmount) + Number(amount.toString()) + ''
// 	} else if (method === 'Withdrawn') {
// 		record.crossedKSMAmount = Number(record.crossedKSMAmount) - Number(amount.toString()) + ''
// 	}

// 	dayRecord.crossedKSMAmount = record.crossedKSMAmount;

// 	record.save()
// 	dayRecord.save()
// }