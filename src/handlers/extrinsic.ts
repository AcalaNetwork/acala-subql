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

export async function createExtrinsic (extrinsic: SubstrateExtrinsic) {
  const signerAccount = extrinsic.extrinsic.signer.toString()

  const data = await ensuerExtrinsic(extrinsic)
  const block = await ensureBlock(extrinsic.block)
  const signer = await ensureAccount(signerAccount)

  data.method = extrinsic.extrinsic.method.method 
  data.section = extrinsic.extrinsic.method.section

  data.args = getKVData(extrinsic.extrinsic.args, extrinsic.extrinsic.argsDef)
  data.signerId = signer.id
  data.nonce = extrinsic.extrinsic.nonce.toBigInt() || BigInt(0)
  data.isSigned = extrinsic.extrinsic.isSigned
  data.timestamp = extrinsic.block.timestamp
  data.signature = extrinsic.extrinsic.signature?.toString()
  data.tip = extrinsic.extrinsic.tip?.toString()
  data.isSuccess = checkIfExtrinsicExecuteSuccess(extrinsic)

  data.blockId = block.id

  await data.save()

  // divide the extrinsic into subcalls
  await createCalls(data, extrinsic)

  return data
}
