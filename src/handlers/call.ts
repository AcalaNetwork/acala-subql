import type { Vec } from '@polkadot/types'
import { Call, Extrinsic } from '../types'
import { AnyCall, DispatchedCallData } from './types'

import { SubstrateExtrinsic } from "@subql/types";
import { Dispatcher, getBatchInterruptedIndex, getKVData } from './utils';
import { createTranserInBalances, createTransferInCurrencies } from './transfer';

const dispatcher = new Dispatcher<DispatchedCallData>()

dispatcher.batchRegist([
  { key: 'currencies-transfer', handler: createTransferInCurrencies },
  { key: 'balances-transferKeepAlive', handler: createTranserInBalances },
])

async function traverExtrinsic(extrinsic: Extrinsic, raw: SubstrateExtrinsic): Promise<Call[]> {
  const list = []
  const batchInterruptedIndex = getBatchInterruptedIndex(raw)

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
    call.signerId = extrinsic.signerId
    call.isSuccess = depth === 0 ? extrinsic.isSuccess : batchInterruptedIndex > idx;
    call.timestamp = extrinsic.timestamp

    if (!isRoot) {
      call.parentCallId = isRoot ? '' : parentCallId

      call.extrinsicId = parentCallId.split('-')[0]
    } else {
      call.extrinsicId = parentCallId
    }

    list.push(call)

    await dispatcher.dispatch(
      `${call.section}-${call.method}`,
      { call, extrinsic, rawCall: data, rawExtrinsic: raw }
    )

    if (depth < 1 && section === 'utility' && (method === 'batch' || method === 'batchAll')) {
      const temp = args[0] as unknown as Vec<AnyCall>

      await Promise.all(temp.map((item, idx) => inner(item, id, idx, false, depth + 1)))
    } 
  }

  await inner(raw.extrinsic.method, extrinsic.id, 0, true, 0)

  return list
}

export async function createCalls (extrinsic: Extrinsic, raw: SubstrateExtrinsic) {

    const calls = await traverExtrinsic(extrinsic, raw)

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
