import { insertDataToEntity, getCommonExtrinsicData } from '../helpers';
import { LoanHistoryEntity } from '../types/models/LoanHistoryEntity';
import { ExtrinsicHandler } from './types';

export const updateLoanHander: ExtrinsicHandler = async (call, extrinsic): Promise<void> => {
    try {
        const { extrinsic: _extrinsic } = extrinsic
        const signer = _extrinsic.signer.toString()
        const [currency, collateralAdjustment, debitAdjustment] = call.args
        const commonExtrinsicData = getCommonExtrinsicData(call, extrinsic)
        const loanHistoryRecord = new LoanHistoryEntity(commonExtrinsicData.hash)
        // get exchange rate at block
        const debitExchangeRate = await api.query.cdpEngine.debitExchangeRate(currency)

        insertDataToEntity(loanHistoryRecord, commonExtrinsicData)

        loanHistoryRecord.account = signer
        loanHistoryRecord.currency = currency.toString()
        loanHistoryRecord.collateralAdjustment = collateralAdjustment.toString()
        loanHistoryRecord.debitAdjustment = debitAdjustment.toString()
        loanHistoryRecord.debitExchangeRate = debitExchangeRate.toString()

        await loanHistoryRecord.save()
    } catch (e) {
        console.log(e)
    }
}