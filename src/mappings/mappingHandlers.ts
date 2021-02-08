import { SignedBlock } from '@polkadot/types/interfaces'
import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types'

import { BlockEntity } from '../types/models/BlockEntity'
import { ExtrinsicDispatcher } from '../dispatchers'
import { getBlockTimestamp } from '../helpers'
import {
    transferHandler,
    updateLoanHander,
    swapWithExactSupplyHandler,
    swapWithExactTargetHandler,
    addLiquidityHandler,
    removeLiquidityHandler
} from '../handlers'

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

extrinsicDispatcher.add('honzon', 'adjustLoan', updateLoanHander)

extrinsicDispatcher.add('dex', 'swapWithExactSupply', swapWithExactSupplyHandler)
extrinsicDispatcher.add('dex', 'swapWithExactTarget', swapWithExactTargetHandler)
extrinsicDispatcher.add('dex', 'addLiquidity', addLiquidityHandler)
extrinsicDispatcher.add('dex', 'removeLiquidity', removeLiquidityHandler)

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    await extrinsicDispatcher.emit(extrinsic)
}
