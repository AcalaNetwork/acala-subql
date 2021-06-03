import { SubstrateBlock, SubstrateExtrinsic } from '@subql/types'
import { getBlockTimestamp } from './utils/getBlockTimestamp'
import { Block } from '../types'
import { initPrices } from './price'
import { initSystemConsts } from './system'
import { initSystemTokens } from './tokens'

let isFirstSync = true

export async function ensureBlock (block: SubstrateBlock) {
  const recordId = block.block.hash.toString()

  let data = await Block.get(recordId)

  if (!data) {
    data = new Block(recordId)

    await data.save()
  }

  return data
}

export async function createBlock (block: SubstrateBlock) {
  if (isFirstSync) {
    await initSystemTokens()
    await initSystemConsts()

    isFirstSync = false
  }

  const data = await ensureBlock(block)

  const blockNumber = block.block.header.number.toBigInt() || BigInt(0)
  const parentHash = block.block.header.parentHash.toString()
  const stateRoot = block.block.header.stateRoot.toString()
  const specVersion = block.specVersion.toString()
  const extrinsicsRoot = block.block.header.extrinsicsRoot.toString()
  const timestamp = getBlockTimestamp(block.block)

  data.number = blockNumber
  data.parentHash = parentHash
  data.stateRoot = stateRoot
  data.extrinsicRoot = extrinsicsRoot
  data.specVersion = specVersion
  data.timestamp = timestamp

  // get prices data in every block
  await initPrices()

  await data.save()

  return data
}
