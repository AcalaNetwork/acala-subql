import { SubstrateExtrinsic } from '@subql/types'

export interface CallData {
    batchIndex?: number // for batch call

    section: string
    method: string
    args: any[]
}

// expand the SubstrateExtrinsic data, add some status
export interface ExtrinsicData extends SubstrateExtrinsic {
    isSudo?: boolean
    isBatch?: boolean
    isExcuteSuccess: boolean
}

export type ExtrinsicExecutor = (
    call: CallData,
    extrinsic: ExtrinsicData,
) => Promise<void>