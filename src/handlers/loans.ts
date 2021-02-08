import { applyDataToEntity, getCommonExtrinsicData } from '../helpers/extrinsic';
import { LoanHistoryEntity } from '../types/models/LoanHistoryEntity';
import { ExtrinsicHandler } from './types';

export const updateLoanHander: ExtrinsicHandler = async (extrinsic, info): Promise<void> => {
    const { extrinsic: _extrinsic } = extrinsic
    const signer = _extrinsic.signer.toString()
    const [currency, collateralAdjustment, debitAdjustment] = _extrinsic.args
    const commonExtrinsicData = getCommonExtrinsicData(extrinsic, info)
    const loanHistoryRecord = new LoanHistoryEntity(commonExtrinsicData.hash)
    // get exchange rate at block
    const debitExchangeRate = await api.query.cdpEngine.debitExchangeRate.at(commonExtrinsicData.block, currency)

    applyDataToEntity(loanHistoryRecord, commonExtrinsicData)

    loanHistoryRecord.account = signer
    loanHistoryRecord.currency = currency.toString()
    loanHistoryRecord.collateralAdjustment = collateralAdjustment.toString()
    loanHistoryRecord.debitAdjustment = debitAdjustment.toString()
    loanHistoryRecord.debitExchangeRate = debitExchangeRate.toString()

    await loanHistoryRecord.save()
}