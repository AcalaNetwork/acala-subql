// import { insertDataToEntity, getCommonExtrinsicData } from '../helpers'
// import { TransferEntity } from '../types/models/TransferEntity'
// import { ExtrinsicExecutor } from './types'

// export const transferHandler: ExtrinsicExecutor = async (call, extrinsic): Promise<void> => {
//     const { extrinsic: _extrinsic } = extrinsic

//     const signer = _extrinsic.signer.toString()
//     const [to, currency, amount] = call.args
//     const commonExtrinsicData = getCommonExtrinsicData(call, extrinsic)
//     const transferRecord = new TransferEntity(commonExtrinsicData.hash)

//     // apply common extrinsic data to record
//     insertDataToEntity(transferRecord, commonExtrinsicData)

//     transferRecord.from = signer.toString()
//     transferRecord.to = to.toString()
//     transferRecord.currency = currency.toString()
//     transferRecord.amount = amount.toString()

//     await transferRecord.save()
// }
