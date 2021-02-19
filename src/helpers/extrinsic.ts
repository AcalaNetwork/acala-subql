import { Entity, SubstrateExtrinsic } from '@subql/types';
import { IEvent } from '@polkadot/types/types'
import { u32 } from '@polkadot/types'
import { DispatchError } from '@polkadot/types/interfaces'
import { ExtrinsicData, CallData } from '../handlers/types';

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

    console.log(interruptedEvent)

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

export const mapExtrinsic = (extrinsic: SubstrateExtrinsic): ExtrinsicData => {
    const { extrinsic: _extrinsic } = extrinsic
    const isBatch = checkIfIsBatch(extrinsic)
    const isSudo = _extrinsic.method.section === 'sudo'
    const isExcuteSuccess = checkIfExtrinsicExecuteSuccess(extrinsic)

    return {
        ...extrinsic,
        isBatch,
        isSudo,
        isExcuteSuccess
    }
}

export const getExtrinsicHash = (call: CallData, extrinsic: ExtrinsicData): string => {
    const { isBatch, extrinsic: _extrinsic } = extrinsic

    if (isBatch) {
        return `${_extrinsic.hash.toString()}-${call.batchIndex}`
    }

    return _extrinsic.hash.toString()
}

export const getCommonExtrinsicData = (call: CallData, extrinsic: ExtrinsicData) => {
    const block = extrinsic.block.block.hash.toString()
    const timestamp = extrinsic.block.timestamp
    const hash = getExtrinsicHash(call, extrinsic)

    return {
        hash,
        block,
        timestamp,
        isSuccess: extrinsic.isExcuteSuccess ? 1 : 0,
        isBatch: extrinsic.isBatch ? 1 : 0,
        isSudo: extrinsic.isSudo ? 1 : 0,
        batchIndex: call.batchIndex ?? 0,
    }
}

export const insertDataToEntity = (entity: Entity, data: Record<string, any>, excludes = ['hash']) => {
    Object.keys(data).forEach((key) => {
        if (excludes.includes(key)) return

        entity[key] = data[key]
    })
}
