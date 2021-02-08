import { SubstrateExtrinsic } from '@subql/types';

export interface ExtrinsicInfo {
    isSudo?: boolean
    isBatch?: boolean
    isSuccess: boolean
    batchIndex?: number
}

export type ExtrinsicHandler = (
    extrinsic: SubstrateExtrinsic,
    info?: ExtrinsicInfo
) => Promise<void>