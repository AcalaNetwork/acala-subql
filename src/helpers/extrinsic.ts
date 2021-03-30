import { Entity, SubstrateExtrinsic } from '@subql/types';
import { IEvent } from '@polkadot/types/types'
import { u32 } from '@polkadot/types'
import { DispatchError } from '@polkadot/types/interfaces'

export const checkIfExtrinsicExecuteSuccess = (extrinsic: SubstrateExtrinsic): boolean => {
    const { events } = extrinsic

    return !events.find((item) => {
        const { event: { method, section }} = item

        return method === 'ExtrinsicFailed' && section === 'system'
    })
}

export const getBatchInterruptedIndex = (extrinsic: SubstrateExtrinsic): number => {
    const { events } = extrinsic

    const interruptedEvent = events.find((event) => {
        const _event = event?.event

        if (!_event) return false

        const { section, method } = _event

        return section === 'utility' && method === 'BatchInterrupted'
    })

    if (interruptedEvent) {
        const { data } = (interruptedEvent.event as unknown) as IEvent<[u32, DispatchError]>

        return Number(data[0].toString())
    }

    return -1
}

export const checkIfIsBatch = (extrinsic: SubstrateExtrinsic): boolean => {
    const { section, method } = extrinsic.extrinsic.method

    if (section === 'utility' && method === 'batch') return true

    if (section === 'utility' && method === 'batchAll') return true

    return false
}
