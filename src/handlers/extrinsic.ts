import { checkIfExtrinsicExecuteSuccess, getKVData } from './utils'
import { SubstrateExtrinsic } from '@subql/types'
import { Extrinsic } from '../types'
import { ensureAccount } from './account'
import { ensureBlock } from './block'
import { createCalls } from './call'

export async function ensuerExtrinsic (extrinsic: SubstrateExtrinsic) {
  const recordId = extrinsic.extrinsic.hash.toString()

  let data = await Extrinsic.get(recordId)

  if (!data) {
    data = new Extrinsic(recordId)

    await data.save()
  }

  return data
}