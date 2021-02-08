import { applyDataToEntity, getCommonExtrinsicData } from '../helpers'
import { TransferEntity } from '../types/models/TransferEntity'
import { ExtrinsicHandler } from './types'

export const transferHandler: ExtrinsicHandler = async (extrinsic, info): Promise<void> => {
    const { extrinsic: _extrinsic } = extrinsic

    const signer = _extrinsic.signer.toString()
    const [to, currency, amount] = _extrinsic.args
    const commonExtrinsicData = getCommonExtrinsicData(extrinsic, info)
    const transferRecord = new TransferEntity(commonExtrinsicData.hash)

    // apply common extrinsic data to record
    applyDataToEntity(transferRecord, commonExtrinsicData)

    transferRecord.from = signer.toString()
    transferRecord.to = to.toString()
    transferRecord.currency = currency.toString()
    transferRecord.amount = amount.toString()

    await transferRecord.save()
}
