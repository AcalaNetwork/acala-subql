import { SubstrateBlock, SubstrateExtrinsic, SubstrateEvent } from '@subql/types'

import { BlockHandler } from '../handlers/Block'
import { ExtrinsicDispatcher } from '../dispatchers'
import { EventHandler, ExtrinsicHandler } from '../handlers'
import { CallHandler } from '../handlers/call'
// import {
//     transferHandler,
//     updateLoanHander,
//     swapWithExactSupplyHandler,
//     swapWithExactTargetHandler,
//     addLiquidityHandler,
//     removeLiquidityHandler
// } from '../extrinsic-executors'

export async function handleBlock(block: SubstrateBlock): Promise<void> {
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
    const extrinsicHandler = new ExtrinsicHandler(extrinsic);

    await extrinsicHandler.save()

    // await extrinsicDispatcher.dispatch(extrinsic)
}
