
import type { CallBase, AnyTuple } from '@polkadot/types/types'
import type { SubstrateExtrinsic } from '@subql/types'
import { Dispatcher } from '../helpers/dispatcher'

export type AnyCall = CallBase<AnyTuple>

export interface DispatchedCallData {
  id: string
  call: AnyCall
  extrinsic: SubstrateExtrinsic
  isSuccess: boolean
}

export type CallDispatcher = Dispatcher<DispatchedCallData>

export type callHandler = (data: DispatchedCallData) => Promise<any>