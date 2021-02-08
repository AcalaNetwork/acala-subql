import { Entity, SubstrateExtrinsic } from '@subql/types';
import { Extrinsic } from '@polkadot/types/interfaces'
import { ExtrinsicInfo } from '../handlers/types';

export const checkIfExtrinsicSuccess = (extrinsic: SubstrateExtrinsic): boolean => {
    const events = extrinsic.events

    return !events.find((item) => {
        const { event: { method, section }} = item

        return method === 'ExtrinsicFailed' && section === 'system'
    })
}

export const getExtrinsicHash = (extrinsic: Extrinsic, info?: ExtrinsicInfo): string => {
    if (info?.isBatch) {
        return `${extrinsic.hash.toString()}-${info.batchIndex}`
    }

    return extrinsic.hash.toString()
}

export const getCommonExtrinsicData = (extrinsic: SubstrateExtrinsic, info: ExtrinsicInfo) => {
    const block = extrinsic.block.block.hash.toString()
    const timestamp = extrinsic.block.timestamp
    const hash = getExtrinsicHash(extrinsic.extrinsic, info)

    return {
        hash,
        isSuccess: info.isSuccess ? 1 : 0,
        isBatch: info.isBatch ? 1 : 0,
        isSudo: info.isSudo ? 1 : 0,
        batchIndex: info.batchIndex ?? 0,
        block,
        timestamp,
    }
}

export const applyDataToEntity = (entity: Entity, data: Record<string, any>, excludes = ['hash']) => {
    Object.keys(data).forEach((key) => {
        if (excludes.includes(key)) return

        entity[key] = data[key]
    })
}
