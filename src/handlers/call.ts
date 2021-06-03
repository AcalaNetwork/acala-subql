import type { Vec } from '@polkadot/types'
import { Call } from '../types'
import { AnyCall, CallDispatcher, DispatchedCallData } from './types'

import { SubstrateExtrinsic } from "@subql/types";
import { checkIfExtrinsicExecuteSuccess, Dispatcher, getBatchInterruptedIndex, getKVData } from './utils';
import { createTranserInBalances, createTransferInCurrencies } from './transfer';

const dispatcher = new Dispatcher<DispatchedCallData>()

dispatcher.batchRegist([
  { key: 'currencies-transfer', handler: createTransferInCurrencies },
  { key: 'balances-transferKeepAlive', handler: createTranserInBalances },
])

async function traverExtrinsic(extrinsic: SubstrateExtrinsic): Promise<Call[]> {
  const list = []
  const signer = extrinsic.extrinsic.signer.toString()
  const timestamp = extrinsic.block.timestamp
  const isSuccess = checkIfExtrinsicExecuteSuccess(extrinsic)
  const batchInterruptedIndex = getBatchInterruptedIndex(extrinsic)

  const inner = async (
    data: AnyCall,
    parentCallId: string,
    idx: number,
    isRoot: boolean,
    depth: number
  ) => {
    const id = isRoot ? parentCallId : `${parentCallId}-${idx}`
    const method = data.method
    const section = data.section
    const args = data.args

    const call = new Call(id)
    call.method = method
    call.section = section
    call.args = getKVData(data.args, data.argsDef)
    call.signerId = signer
    call.isSuccess = depth === 0 ? isSuccess : batchInterruptedIndex > idx;
    call.timestamp = timestamp

    if (!isRoot) {
      call.parentCallId = isRoot ? '' : parentCallId

      call.extrinsicId = parentCallId.split('-')[0]
    } else {
      call.extrinsicId = parentCallId
    }

    list.push(call)

    // await dispatcher.dispatch(
    //   `${call.section}-${call.method}`,
    //   { id: call.id, call: data, extrinsic: extrinsic, isSuccess: call.isSuccess }
    // )

    if (depth < 1 && section === 'utility' && (method === 'batch' || method === 'batchAll')) {
      const temp = args[0] as unknown as Vec<AnyCall>

      await Promise.all(temp.map((item, idx) => inner(item, id, idx, false, depth + 1)))
    } 
  }

  await inner(extrinsic.extrinsic.method, extrinsic.extrinsic.hash.toString(), 0, true, 0)

  return list
}

export async function createCalls (extrinsic: SubstrateExtrinsic) {

    const calls = await traverExtrinsic(extrinsic)

    await Promise.all(calls.map(async (item) => item.save()));
}

export async function ensureCallExist (id) {
  let data = await Call.get(id)

  if (!data) {
    data = new Call(id)

    await data.save()
  }

  return data
}
