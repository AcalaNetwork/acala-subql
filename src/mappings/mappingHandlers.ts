import { SignedBlock } from '@polkadot/types/interfaces'
import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { BlockEntity } from '../types/models/BlockEntity'
import { ExtrinsicDispatcher } from '../dispatchers'
import { transferHandler } from '../handlers'
import { getBlockTimestamp } from '../helpers'

export async function handleBlock(block: SignedBlock): Promise<void> {
    const blockNumber = block.block.header.number.toBigInt()
    const blockHash = block.block.hash.toString()
    //Create a new blockEntity with ID using block hash
    const record = new BlockEntity(blockHash)

    //Record block information
    record.number = blockNumber
    record.timestamp = getBlockTimestamp(block.block)

    await record.save()
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
}

const extrinsicDispatcher = new ExtrinsicDispatcher()

// apply extrinsic handler
extrinsicDispatcher.add('currencies', 'transfer', transferHandler)

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    await extrinsicDispatcher.emit(extrinsic)
}
