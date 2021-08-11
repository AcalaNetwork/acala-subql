
import type { CallBase, AnyTuple } from '@polkadot/types/types'
import type { SubstrateEvent, SubstrateExtrinsic } from '@subql/types'
import { Call, Extrinsic, Event } from '../types/models'
import { Dispatcher } from './utils/dispatcher'

export type AnyCall = CallBase<AnyTuple>

export interface DispatchedCallData {
  call :Call
  extrinsic: Extrinsic
  rawCall: AnyCall
  rawExtrinsic: SubstrateExtrinsic
}

export type CallDispatcher = Dispatcher<DispatchedCallData>

export type CallHandler = (data: DispatchedCallData) => Promise<any>

export type DispatchedEventData = {
  event: Event
  rawEvent: SubstrateEvent
}

export type EventDispatcher = Dispatcher<DispatchedEventData>

export type EventHandler = (data: DispatchedEventData) => Promise<any>