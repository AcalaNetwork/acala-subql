import { SubstrateBlock, SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { createEvent, createExtrinsic, createBlock } from '../handlers';

export async function handleBlock(block: SubstrateBlock): Promise<void> {
    await createBlock(block);
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    await createEvent(event)
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    await createExtrinsic(extrinsic)
}
