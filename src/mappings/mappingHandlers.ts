import { SignedBlock } from '@polkadot/types/interfaces'
import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types'

import { BlockHandler } from '../handlers/Block'
import { ExtrinsicDispatcher } from '../dispatchers'
import { EventHandler } from '../handlers'
// import {
//     transferHandler,
//     updateLoanHander,
//     swapWithExactSupplyHandler,
//     swapWithExactTargetHandler,
//     addLiquidityHandler,
//     removeLiquidityHandler
// } from '../extrinsic-executors'

export async function handleBlock(block: SignedBlock): Promise<void> {
    const handler = new BlockHandler(block)

    await handler.save()
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const handler = new EventHandler(event)

    await handler.save()
}

const extrinsicDispatcher = new ExtrinsicDispatcher()

// apply extrinsic handler
// extrinsicDispatcher.addExecutor('currencies', 'transfer', transferHandler)
// extrinsicDispatcher.addExecutor('honzon', 'adjustLoan', updateLoanHander)
// extrinsicDispatcher.addExecutor('dex', 'swapWithExactSupply', swapWithExactSupplyHandler)
// extrinsicDispatcher.addExecutor('dex', 'swapWithExactTarget', swapWithExactTargetHandler)
// extrinsicDispatcher.addExecutor('dex', 'addLiquidity', addLiquidityHandler)
// extrinsicDispatcher.addExecutor('dex', 'removeLiquidity', removeLiquidityHandler)

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    // await extrinsicDispatcher.dispatch(extrinsic)
}
